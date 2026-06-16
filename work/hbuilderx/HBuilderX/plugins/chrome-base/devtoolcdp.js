const CDP = require('chrome-remote-interface');
const hx = require('hbuilderx');
function strictFunc(latitude, longitude) {
	navigator.geolocation.getCurrentPosition = function(success, failed) {
		var coords = {
			accuracy: 200,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			latitude: latitude,
			longitude: longitude,
			speed: null
		};
		var timestamp = Date.now();
		success({
			coords: coords,
			timestamp: timestamp
		});
	}
}

async function setGeolocation(params) {
	var port = params.port;
	var client = await getcanEmulateTarget(port);
	if (!client) return;
	var scpt = strictFunc.toString();
	var location = params.location;
	var latitude = location.latitude;
	var longitude = location.longitude;
	const {
		Page,
		Runtime
	} = client;
	await Page.enable();
	await Runtime.evaluate({
		expression: `(${scpt})(${latitude},${longitude})`
	});
	await Page.addScriptToEvaluateOnNewDocument({
		source: `(${scpt})(${latitude},${longitude})`
	});
}

let cdpMap = new Map();
async function getcanEmulateTarget(port, host) {
	var client;
	if (!host) {
		host = "127.0.0.1";
	}
	var url = host + ":" + port;
	if (cdpMap.has(url)) {
		client = cdpMap.get(url);
		if (client) {
			return client;
		}
	}

	try {
		var list = await CDP.List({
			host: host,
			port: port
		});

		if (!list) {
			return client;
		}
		
		list = list.filter(function(item) {
			if (!item.url.includes('devtools/inspector.html') && !item.url.includes('devtools/devtools_app.html') && !cdpMap.has(item.url)) {
				return true
			}
		});
		
		for (var o of list) {
			client = await CDP({
				port: port,
				target: o.webSocketDebuggerUrl,
			});
			var emulate = await client.Emulation.canEmulate();
			// console.log(emulate);
			if (emulate && emulate.result) {
				// return client;
				break;
			}
			client = null;
		}
	} catch (e) {
		client = null;
		console.log(e);
	}

	if (client) {
		cdpMap.set(url, client);
		client.on('event', function(message) {
			console.log("event::", message);
			if (message.method === 'Inspector.detached') {
				if (url) {
					var myClient = cdpMap.get(url);
					if (myClient) {
						myClient.close();
					}
					cdpMap.delete(url);
				}
			}
		});
	}

	return client;
}

async function setDeviceMetricsOverride(params) {
	var port = params.port;
	var client = await getcanEmulateTarget(port);
	if (!client) return;
	var device = params.device;
	const {
		Emulation
	} = client;
	var mobile = false;
	if (device.ismobile) {
		mobile = true;
	}
	await Emulation.setDeviceMetricsOverride({
		width: device.pagesize.width,
		height: device.pagesize.height,
		deviceScaleFactor: device.factor,
		mobile: mobile,
		scale: device.scale,
		dontSetVisibleSize: true
	});
}

async function setTouchEmulationEnabled(params) {
	var port = params.port;
	var client = await getcanEmulateTarget(port);
	if (!client) return;
	var enabled = false;
	var configuration = 'desktop';
	if (params.touch) {
		enabled = true;
	}
	if (enabled) {
		configuration = 'mobile'
	}

	const {
		Emulation
	} = client;
	await Emulation.setTouchEmulationEnabled({
		enabled
	})
	await Emulation.setEmitTouchEventsForMouse({
		enabled: enabled,
		configuration: configuration
	});
	return enabled;
}

function getNodePathByNodeId(nodes, nodeId, path, depth) {
	if (depth) {
		depth = 1;
	}

	if (depth > 1500) {
		return;
	}

	depth++;
	if (nodes.root) {
		if (nodes.nodeId == nodeId) {
			var res = index + "," + onenode.nodeName;
			if (path) {
				res = path + "," + index + "," + onenode.nodeName;
			}
			return res;
		}

		var children = nodes.root.children;		
		if (children) {
			for (var index in children) {
				var onenode = children[index];
				if (onenode.nodeId == nodeId) {
					var res = index + "," + onenode.nodeName;
					if (path) {
						res = path + "," + index + "," + onenode.nodeName;
					}
					return res;
				}

				if (onenode.children) {
					var res = index + "," + onenode.nodeName;
					if (path) {
						res = path + "," + index + "," + onenode.nodeName;
					}
					let prefilter = onenode.children.filter(function(item) {return item.nodeType == 1})
					var ret = getNodePathByNodeId(prefilter, nodeId, res, depth);
					if (ret) {
						return ret;
					}
				}
			}
		}
	}

	for (var index in nodes) {
		var onenode = nodes[index];
		if (onenode.nodeId == nodeId) {
			var res = index + "," + onenode.nodeName;
			if (path) {
				res = path + "," + index + "," + onenode.nodeName;
			}
			return res;
		}
		if (onenode.children) {
			var res = index + "," + onenode.nodeName;
			if (path) {
				res = path + "," + index + "," + onenode.nodeName;
			}
			let prefilter = onenode.children.filter(function(item) {return item.nodeType == 1})
			var ret = getNodePathByNodeId(prefilter, nodeId, res, depth);
			if (ret) {
				return ret;
			}
		}
	}
}


async function highlightDOMNode(params) {
	var port = params.port;
	var client = await getcanEmulateTarget(port);
	if (!client) return;

	const {
		DOM,
		Page
	} = client;
	console.log(params);
	var info = params.info;
	await Page.enable();
	var layoutMetrics = await Page.getLayoutMetrics();
	await DOM.enable();
	var x = info.x + layoutMetrics.layoutViewport.pageX;
	var y = info.y + layoutMetrics.layoutViewport.pageY;
	var nodeForLocation = await DOM.getNodeForLocation({
		x: x,
		y: y
	});

	if (nodeForLocation.hasOwnProperty("nodeId")) delete nodeForLocation["nodeId"];
	let root = await DOM.getDocument({
		depth: -1,
	});
	let resolvedNode = await DOM.resolveNode(nodeForLocation);
	let nodeId = await DOM.requestNode({
		objectId: resolvedNode.object.objectId,
	});

	// console.log("nodeId:",nodeId);
	var nodePath = getNodePathByNodeId(root, nodeId.nodeId);
	//console.log("nodePath:",nodePath);
	//   nodePath = "1,HTML,1,BODY,4,P";
	if (nodePath) {
		var requestParams = {
			documentUrl: root.root.documentURL,
			nodePath: nodePath
		};
		await hx.request("builtinbrowserhost.domNodeLocated", requestParams);
	}
}

function getNodeIdByNodePath(nodes, nodePath) {	
	
	  if (!nodes || !nodePath) {
		  return;
	  }
	  if (!nodes.children) {
		  return;
	  }
  
	  var arr = nodePath.split(",");
	  if (!arr || arr.length < 2 || arr.length % 2 != 0) {
		  return;
	  }
  
	  let paths = [];
	  for (let index = 0; index < arr.length; index += 2) {
		  paths.push({index: arr[index], nodeName: arr[index + 1]});
	  }
	  
	  let children = nodes.children
	  let tmpnode = undefined;
	  for (const pathNode of paths) {
		  children = children.filter(function(item) {return item.nodeType == 1})
		  let prefilter = children.filter(function(item) {return item.nodeName == 'HTML'})
		  if(prefilter.length > 0) {
			  children = prefilter[0].children
			  continue			
		  }			
		  tmpnode = children[pathNode.index];
		  if (!tmpnode) {
			  return children.nodeId			
		  }	
	  
		  children = tmpnode.children;
	  }
	  if(!tmpnode) {
		  return 0
	  }
	  return tmpnode.nodeId
  }

async function highlightDomNodeBuiltinBrowser(params) {
	var port = params.port;
	var client = await getcanEmulateTarget(port);
	const {
		DOM,
		Overlay
	} = client;
	await DOM.enable();
	let root = await DOM.getDocument({
		depth: -1
	});

	if (!root || !root.root) {
		return;
	};

	var nodePath = params.nodePath;
	var nodeId = getNodeIdByNodePath(root.root, nodePath);
	
	if (!nodeId) {
		return;
	}

	await Overlay.enable();
	await Overlay.highlightNode({
		highlightConfig: {
			borderColor: {
				r: 255,
				g: 229,
				b: 153,
				a: 0.66
			},
			contentColor: {
				r: 111,
				g: 168,
				b: 220,
				a: 0.66
			},
			cssGridColor: {
				r: 75,
				g: 0,
				b: 130
			},
			eventTargetColor: {
				r: 255,
				g: 196,
				b: 196,
				a: 0.66
			},
			marginColor: {
				r: 246,
				g: 178,
				b: 107,
				a: 0.66
			},
			paddingColor: {
				r: 147,
				g: 196,
				b: 125,
				a: 0.55
			},
			shapeColor: {
				r: 96,
				g: 82,
				b: 177,
				a: 0.8
			},
			shapeMarginColor: {
				r: 96,
				g: 82,
				b: 127,
				a: 0.6
			},
			showExtensionLines: false,
			showInfo: true,
			showStyles: false,
		},
		nodeId: nodeId
	});
	await new Promise(resolve => setTimeout(resolve, 2000));	
	await DOM.hideHighlight();
}

module.exports = {
	setGeolocation,
	setDeviceMetricsOverride,
	setTouchEmulationEnabled,
	highlightDOMNode,
	highlightDomNodeBuiltinBrowser
}