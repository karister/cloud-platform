const rpc = require('vscode-jsonrpc/node');
const CDP = require('chrome-remote-interface');
const sourceMap = require('source-map-builder');
const args = process.argv.slice(2)
let pipeName = ''
let connection = undefined
const [cdpServerPipeName, cdpServerPipeNameValue] = args
if (cdpServerPipeName === '--cdpServerPipeName') {
	pipeName = cdpServerPipeNameValue
}
let scriptParsedMap = new Map();
let cdpRuntimeMap = {};
let unsubscribeMap = new Map();
const formatUrl = (url) => {
	try {
		return new URL(url)
	} catch (e) {
		console.error('无效的URL地址', url);
	}
	return {}
}

const sleep = (m) => {
	return new Promise((r) => {
		setTimeout(r, m)
	})
}

const getClient = async (port, host, url = '') => {
	if (!host) {
		host = "127.0.0.1";
	}
	if (!cdpRuntimeMap[port]) {
		cdpRuntimeMap[port] = new Map()
	}
	let client = undefined
	try {
		// 根据规则取
		const targetUrl = formatUrl(url);
		client = await CDP({
			host,
			port,
			target: (targets) => {
				return targets.find(({
					url
				}) => {
					const cpdUrl = formatUrl(url);
					if (targetUrl.origin !== 'null' && cpdUrl.origin === targetUrl.origin) {
						return true
					}
				})
			}
		});
	} catch (e1) {
		try {
			// 取不到指定url的，按照非去取，适配内置浏览器
			client = await CDP({
				host,
				port,
				target: (targets) => {
					return targets.find(({
						url,
						webSocketDebuggerUrl
					}) => {
						if (!url.includes('devtools/bundled/inspector.html') && !url.includes('devtools/inspector.html') && !url.includes('devtools/devtools_app.html') && !cdpRuntimeMap[port].get(webSocketDebuggerUrl)) {
							return true
						}
					})
				}
			});
		} catch (e2) {
			console.error(e1, e2);
		}
	}
	if (cdpRuntimeMap[port].get(client?.webSocketUrl)) {
		return {
			client,
			initialized: true
		}
	} else {
		cdpRuntimeMap[port].set(client?.webSocketUrl, client)
		return {
			client,
			initialized: false
		}
	}
}

const cdpInitiatile = async (data) => {
	const {
		port,
		host,
		url,
		sourceType,
		windowId
	} = data
	const {
		client,
		initialized
	} = await getClient(port, host, url, windowId)
	if (client) {
		const {
			Runtime,
			Debugger,
			Network
		} = client;
		if (!initialized) {
			await Network.setCacheDisabled({
				cacheDisabled: true
			}) //无效，通过禁用缓存获取正确的sourceMap
			await Runtime.enable();
			await Debugger.enable();
			client.on('Inspector.detached', async () => {
				cdpRuntimeMap[port].delete(client.webSocketUrl);
				await client.close();
			});
			client.on('Debugger.scriptParsed', (params) => {
				const scriptId = params.scriptId;
				if (scriptId) {
					scriptParsedMap.set(scriptId, params);
				}
			});
			let logList = []
			let logState = false
			const logTask = async () => {
				if (logState) return
				const log = logList.shift()
				if (!log) {
					return
				}
				const {
					client,
					event,
					sourceType,
					callUrl
				} = log
				const unsubscribe = unsubscribeMap.get(formatUrl(callUrl)?.origin)
				if (unsubscribe) {
					// 清除此url下所有待打印的数据
					logList = logList.filter((log) => {
						return formatUrl(log?.callUrl)?.origin !== formatUrl(callUrl)?.origin
					})
					return
				}
				logState = true
				try {
					await onConsoleApiCalledEvent(client, event, sourceType)
				} catch (e) {}
				logState = false
				await logTask()
			}
			Runtime.consoleAPICalled((event) => {
				try {
					let callUrl;
					if (event?.stackTrace?.callFrames) {
						for (let frame of event?.stackTrace?.callFrames) {
							if (frame?.url.startsWith("http")) {
								callUrl = frame.url;
								break;
							}
						}
					}
					try {
						logList.push({
							client,
							event,
							sourceType,
							callUrl
						})
						logTask()
					} catch (e) {
						console.error("onConsoleApiCalledEvent", e);
					}
				} catch (e) {
					console.log(e);
				}

			});
		}
	}
}

const RuntimeGetPropertiesById = async (client, {
	objectId,
	deep,
	preview
}) => {
	try {
		var properties = await client.Runtime.getProperties({
			objectId: objectId,
			ownProperties: true,
			accessorPropertiesOnly: false,
			generatePreview: true,
			nonIndexedPropertiesOnly: false
		});
		if (properties && properties.result && properties.result.length > 0) {
			return properties.result.map((item) => {
				if (!item.enumerable) {
					return false
				}
				const res = {
					name: item.name,
					deep,
					...item.value
				}
				return res
			}).filter(Boolean);
		} else {
			return preview?.properties || []
		}
	} catch (e) {
		// 返回原始数据
		return preview?.properties || []
		// return 'error'
	}
}

const onConsoleApiCalledEventDataFormat = async (client, event, maxDeep = 1) => {
	const result = {
		data: {},
		url: '',
		type: event.type
	};

	const format = (arg) => {

		const {
			type,
			subtype: subType,
			value,
			className,
			description,
			preview,
			timeout,
			maxDeepLimit,
			clientError
		} = arg
		if (className === 'Object') {
			delete arg.className
		}
		if (className === 'Array') {
			delete arg.className
		}
		if (subType) {
			if (!['node'].includes(subType)) {
				arg.subType = subType
			}
			delete arg.subtype
		}
		// type
		// Allowed Values: object, function, undefined, string, number, boolean, symbol, bigint
		// subtype
		// Allowed Values: array, null, node, regexp, date, map, set, weakmap, weakset, iterator, generator, error, proxy, promise, typedarray, arraybuffer, dataview, webassemblymemory, wasmvalue

		if (type === 'object') {
			if (timeout) {
				arg.value = '[timeout]'
				return arg
			}
			if (maxDeep > 1 && maxDeepLimit) {
				arg.value = '[depth-max-limit]'
				return arg
			}
			if (clientError) {
				arg.value = '[clinet-error]'
				return arg
			}
			arg.value = preview || arg.value
			if (arg.value === 'Object') {
				arg.value = {
					properties: []
				}
			}
			delete arg.preview
			if (subType === 'set') { //TODO SET MAP
				arg.value.entries = arg.value?.entries?.map((item) => {
					if (item.value.type === 'object') {
						item.value.value = {
							properties: item.value.properties || []
						}
					}
					return item
				})
			}
			if (subType === 'map') {
				arg.value.entries = arg.value?.entries?.map((item) => {
					if (item?.key?.type === 'object') {
						item.key.value = {
							properties: item.key.properties || []
						}
					}
					if (item?.value?.type === 'object') {
						item.value.value = {
							properties: item.value.properties || []
						}
					}
					return item
				})
			}

			// 其他简单数据结构
			if (subType === 'date' || subType === 'regexp') {
				arg.value = description
			}
			if (subType === 'error') {
				if (arg.value?.properties) {
					arg.value = {
						properties: [arg.value?.properties?.find(({
							name
						}) => {
							return name === 'message'
						})].filter(Boolean)
					}
				}
			}
			if (subType === 'null') {
				arg.value = "null"
			}
			if (subType === 'typedarray' || subType === 'arraybuffer') {
				arg.subType = 'array'
			}
			if (subType === 'blob') {
				arg.subType = 'object'
			}
			if (arg?.value?.properties && subType !== 'error') { //TODO error的object不走这个处理
				arg.value.properties = arg.value.properties.map((propertie) => {
					return format(propertie)
				})
			}
			return arg
		} else if (type === 'function') {
			if (!value) {
				arg.value = description
			}
			return arg
		} else if (type === 'bigint') {
			arg.value = description
			return arg
		} else if (type === 'symbol') {
			arg.value = description
			return arg
		} else if (type === 'undefined') {
			arg.value = type
			return arg
		} else {
			return arg
		}
	}
	let sourceLine = ''
	const [{
		scriptId,
		url,
		lineNumber,
		columnNumber
	}] = event?.stackTrace?.callFrames || [{}]
	if (scriptId) {
		const data = scriptParsedMap.get(scriptId);
		let sourceMapURL = data?.sourceMapURL;
		if (!sourceMapURL) {
			// Debugger.scriptParsed 异步加载慢的情况下，等1秒再去获取
			await sleep(500)
			const data = scriptParsedMap.get(scriptId);
			sourceMapURL = data?.sourceMapURL;
		}
		if (sourceMapURL) {
			if (/^data:.*;base64,/.test(sourceMapURL)) {
				const base64Data = sourceMapURL.replace(/^data:.*;base64,/, '')
				const sourcemapBuffer = Buffer.from(base64Data, 'base64');
				const sourcemapString = sourcemapBuffer.toString('utf8');
				const sourcemapJSON = JSON.parse(sourcemapString);
				// vue2的情况
				const sourcePath = sourcemapJSON.sources[0].replace('uni-app:///', '');
				// vue3的情况
				// const sourcePath = sourcemapJSON.sources[0].replace('uni-app:///', '');
				const smb = new sourceMap.SourceMapBuilder(sourcemapJSON);
				const s = smb.getSource(lineNumber, columnNumber);
				const line = Number(s?.line) + 1;
				sourceLine = ` at ${sourcePath}:${line}`
			} else {
				console.log(sourceMapURL);
			}
		} else {
			const urlObject = formatUrl(url);
			const line = Number(lineNumber) + 1;
			const sourcePath = urlObject?.pathname?.replace(/^\/(.*)/, "$1");
			sourceLine = ` at ${sourcePath}:${line}`
		}
	}
	if (url?.startsWith("http")) {
		result.url = url;
	} else {
		if (event?.stackTrace?.callFrames) {
			for (let frame of event?.stackTrace?.callFrames) {
				if (frame?.url?.startsWith("http")) {
					result.url = frame.url;
					break;
				}
			}
		}
	}
	result.lineNumber = lineNumber;
	const beginTime = +new Date()
	const timeout = 3000
	const BFSList = event.args.map((i) => {
		i.deep = 0
		return i
	})
	let args = []
	// 先取数据后格式化数据 可以合一
	// 数据获取
	while (BFSList.length > 0) {
		const arg = BFSList.shift()
		const {
			subtype: subType
		} = arg
		if (arg?.preview?.properties && subType !== 'error') {
			const currentTime = +new Date()
			if (currentTime - beginTime > timeout) {
				arg.timeout = true
				arg.preview.properties = []
				continue
			}
			if (arg.deep && arg.deep >= maxDeep) {
				arg.maxDeepLimit = true
				arg.preview.properties = []
			} else {
				arg.deep = ++arg.deep
				const properties = await RuntimeGetPropertiesById(client, arg)
				if (properties === 'error') {
					arg.clientError = true
					arg.preview.properties = []
				}
				arg.preview.properties = properties
				BFSList.push(...arg.preview.properties)
			}
		}
		if (args.length < event.args.length) { // 第一组的遍历完，后面对象为引用赋值。不在第一层结构里面。
			args.push(arg)
		}
	}
	// 获取格式化
	args = args.map((arg) => {
		return format(arg)
	})
	// console.log(JSON.stringify(args, null, 2));
	result.data = args
	result.sourceLine = sourceLine
	return result
}
const onConsoleApiCalledEvent = async (client, event, source = 'BuiltIn') => {
	try {
		const result = await onConsoleApiCalledEventDataFormat(client, JSON.parse(JSON.stringify(event)), 1)
		result.originArgs = event.args
		result.client = {
			port: client.port,
			webSocketUrl: client.webSocketUrl
		}
		result.source = source
		notificationConsoleAPICalled(result)
	} catch (e) {}

}

const notification = new rpc.NotificationType('consoleAPICalled');
const notificationConsoleAPICalled = (data) => {
	if (connection) {
		connection.sendNotification(notification, data)
	}
}

if (pipeName) {
	try {
		let readerWriter = rpc.createServerPipeTransport(pipeName);
		connection = rpc.createMessageConnection(readerWriter[0], readerWriter[1]);
		connection.listen();
		connection.onDispose(() => {
			console.log('Client onDispose');
			connection = undefined
		})
		connection.onError(() => {
			console.log('Client onError');
			connection = undefined
		})
		connection.onClose(() => {
			console.log('Client onClose');
			connection = undefined
		})
		connection.onRequest("cdpInit", async function(data) {
			try {
				return await cdpInitiatile(data)
			} catch (e) {}
		});
		connection.onRequest("unsubscribe", async function(data) {
			unsubscribeMap.set(formatUrl(data.url)?.origin, true)
		});
		connection.onRequest("subscribe", async function(data) {
			unsubscribeMap.set(formatUrl(data.url)?.origin, false)
		});
		connection.onRequest("getDeepData", async function(data) {
			try {
				const {
					port,
					webSocketUrl
				} = data.client
				const client = cdpRuntimeMap[port].get(webSocketUrl)
				if (client) {
					const res = await onConsoleApiCalledEventDataFormat(client, JSON.parse(JSON.stringify({
						args: [data.args]
					})), 7)
					return res.data[0]
				} else {
					return
				}
			} catch (e) {
				return
			}
		});
	} catch (e) {
		console.log(e);
	}
}