const path = require('path');
const fs = require('fs');
const packageInfo = require('./package.json');
const ErrorStackParser = require('./error-stack-parser');
const enableSourceMaps = process.execArgv && process.execArgv.indexOf("--enable-source-maps") >= 0;
let HBUILDER_EXTENSIONS_DIR = process.env.HBUILDER_EXTENSIONS_DIR || path.resolve(process.execPath, "../../");
HBUILDER_EXTENSIONS_DIR = HBUILDER_EXTENSIONS_DIR.replace(new RegExp('\\\\', 'g'), '/').toLowerCase();
let HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH = process.env.HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH || ''
HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH = HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH.replace(new RegExp('\\\\', 'g'), '/').toLowerCase();

function isDevelopmentPlugin(pluginFile) {
	pluginFile = pluginFile.replace(new RegExp('\\\\', 'g'), '/').toLowerCase();
	if (pluginFile.startsWith(HBUILDER_EXTENSIONS_DIR)) {
		return false;
	}
	if (HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH) {
		if (pluginFile.startsWith(HBUILDERX_PLUGIN_MANAGER_CUSTOM_PATH)) {
			return false;
		}
	}
	return true;
}


['debug', 'log', 'warn', 'error'].forEach((methodName) => {
	const originalLoggingMethod = console[methodName];
	console[methodName] = (firstArgument, ...otherArguments) => {
		let developmentPlugin = false
		const originalPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (_, stack) => stack;
		let callee = new Error().stack[1]; // 第一个元素就是实际抛出位置
		Error.prepareStackTrace = originalPrepareStackTrace;
		let relativeFileName = path.resolve(process.cwd(), callee.getFileName());
		let lineNum = callee.getLineNumber() || 0;
		let columnNum = callee.getColumnNumber() || 0;

		if (enableSourceMaps && !fs.existsSync(relativeFileName)) { //如果文件不存在，则尝试看下sourcemap里面有没有
			callee = ErrorStackParser.parse(new Error())[1];
			relativeFileName = path.resolve(process.cwd(), callee.getFileName());

			lineNum = callee.getLineNumber() || 1;
			columnNum = callee.getColumnNumber() || 1;
			lineNum--;
			columnNum--;
		}
		developmentPlugin = isDevelopmentPlugin(relativeFileName)
		otherArguments.push(`\t${relativeFileName}:${lineNum}:${columnNum}`);
		prefix = []
		if (!developmentPlugin) {
			prefix.push('\u200B')
		} else {
			prefix.push('\u200C')
		}
		originalLoggingMethod(...prefix, firstArgument, ...otherArguments);
	};
});
let mainProgram = packageInfo.main;
if (!mainProgram.startsWith("./")) {
	mainProgram = "./" + mainProgram;
}

require(mainProgram);