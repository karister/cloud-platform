const rpc = require('vscode-jsonrpc/node');
const hx = require('hbuilderx');
const {
	fork
} = require('child_process');
const {
	Publisher
} = require("./utils.js");
const {
	resolve
} = require('path');
const devtoolcdp = require("./devtoolcdp.js");
const CDP = require('chrome-remote-interface');

// 全局的连接对象
let connection = undefined
const publisherBuiltInConsoleAPICalled = new Publisher();
const publisherChromeConsoleAPICalled = new Publisher();

const subscribeBuiltInConsoleAPICalled = (subscribe) => {
	publisherBuiltInConsoleAPICalled.subscribe(subscribe);
	checkSubscribe(subscribe)
}

const unsubscribeBuiltInConsoleAPICalled = (subscribe) => {
	publisherBuiltInConsoleAPICalled.unsubscribe(subscribe);
	checkUnsubscribe(subscribe)
}

const subscribeChromeConsoleAPICalled = (subscribe) => {
	publisherChromeConsoleAPICalled.subscribe(subscribe);
	checkSubscribe(subscribe)
}

const unsubscribeChromeConsoleAPICalled = (subscribe) => {
	publisherChromeConsoleAPICalled.unsubscribe(subscribe);
	checkUnsubscribe(subscribe)
}

const checkUnsubscribe = (subscribe) => {
	const isPublisher = publisherBuiltInConsoleAPICalled.findSubscriberByUrl(subscribe?.url) ||
		publisherChromeConsoleAPICalled.findSubscriberByUrl(subscribe?.url)
	if (!isPublisher || (isPublisher && isPublisher?.length === 0)) {
		if (connection) {
			connection.sendRequest('unsubscribe', {
				url: subscribe?.url
			})
		}
	}
}
const checkSubscribe = (subscribe) => {
	if (connection) {
		connection.sendRequest('subscribe', {
			url: subscribe?.url
		})
	}
}



const generateRandomPipeName = () => {
	return rpc.generateRandomPipeName()
}

const initRpcClient = async (cdpServerPipeName) => {
	const client = await rpc.createClientPipeTransport(cdpServerPipeName);
	const readerWriter = await client.onConnected()
	let connection = rpc.createMessageConnection(readerWriter[0], readerWriter[1]);
	connection.listen()
	return connection
}

const forkCdp = async (cdpServerPipeName) => {
	const cdpServerPath = resolve(hx.env.appRoot, './plugins/chrome-base/cdp.js')
	const args = ['--cdpServerPipeName', cdpServerPipeName]
	const cdpProcess = fork(cdpServerPath, args, {
		silent: true,
		// execArgv: ['--inspect-brk=1234'],
		execArgv: [],
		env: {
			...process.env,
		}
	})
	cdpProcess.on('close', (code, signal) => {
		console.log('cdpProcessExit', code, signal);
		connection = undefined
	})
	console.log('forkCdpPid', cdpProcess.pid);
	process.on('exit', () => {
		cdpProcess.kill('SIGKILL')
	})
}

function activate() {
	return {
		consoleMessage() {},
		async connectNewTab(data) {
			// 等待,可能会导致cdp链接不上卡主运行。不等待，可能导致启动起来没日志。目前是不等待
			if (!connection) {
				const cdpServerPipeName = generateRandomPipeName()
				initRpcClient(cdpServerPipeName).then(async (c) => {
					connection = c
					connection.onDispose(() => {
						console.log('Server onDispose');
						connection = undefined
					})
					connection.onError((...a) => {
						console.log('Server onError', a);
						connection = undefined
					})
					connection.onClose(() => {
						console.log('Server onClose');
						connection = undefined
					})
					let notification = new rpc.NotificationType('consoleAPICalled');
					connection.onNotification(notification, (data) => {
						data.getDeepData = async (args) => {
							return await connection.sendRequest('getDeepData', {
								client: data.client,
								args
							})
						}
						if (data.source === 'BuiltIn') {
							publisherBuiltInConsoleAPICalled.publish(data)
						}
						if (data.source === 'Chrome') {
							publisherChromeConsoleAPICalled.publish(data)
						}
					})
					await connection.sendRequest('cdpInit', data)
				}).catch((err) => {
					console.log(err);
				})
				forkCdp(cdpServerPipeName)
			} else {
				await connection.sendRequest('cdpInit', data)
			}
		},
		async cdpMethods(data) {
			await connection.sendRequest('cdpMethods', data)
		},
		CDP,
		subscribeBuiltInConsoleAPICalled,
		unsubscribeBuiltInConsoleAPICalled,
		subscribeChromeConsoleAPICalled,
		unsubscribeChromeConsoleAPICalled,
		setTouchEmulationEnabled: devtoolcdp.setTouchEmulationEnabled,
		setDeviceMetricsOverride: devtoolcdp.setDeviceMetricsOverride,
		setGeolocation: devtoolcdp.setGeolocation,
		highlightDomNodeLocated: devtoolcdp.highlightDOMNode,
		highlightDomNodeBuiltinBrowser: devtoolcdp.highlightDomNodeBuiltinBrowser
	}
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}