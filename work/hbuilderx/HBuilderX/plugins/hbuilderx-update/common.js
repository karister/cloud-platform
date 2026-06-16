const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');


let HBuilderXPath = "";
if(process.platform === 'win32'){
	HBuilderXPath = path.join(os.homedir(), 'AppData', 'Roaming', 'HBuilder X');
}else{
	const applicationSupportPath = path.join(os.homedir(), 'Library', 'Application Support');
	HBuilderXPath = path.join(applicationSupportPath, 'HBuilder X');
}
// const logforloggerfile = path.join(HBuilderXPath, '.logger.log');
// function logforlogger(...msg){
//     fs.appendFileSync(logforloggerfile, util.format(...msg) + '\n');
// }
function logger(logFileName){
    class LOGGER{
        constructor(logFileName){
            
            this.logFileName = logFileName;
            const filePath = path.join(HBuilderXPath, this.logFileName);
            if(fs.existsSync(filePath)){
                // logforlogger(`size:${fs.statSync(filePath).size}`);
            }
            if(fs.existsSync(filePath) && (fs.statSync(filePath).size > 1024000)){
                // 
                const dir = path.dirname(logFileName);
                const file = path.basename(logFileName);
                const dt = new Date;
                const fstr = `${parseInt(dt.getTime()/1000)}_${file}`;
                const backupf = path.join(HBuilderXPath, dir, fstr);                
                fs.renameSync(filePath, backupf);
            }else{
                // logforlogger(`${filePath} ?`);
            }
            const dir = path.dirname(filePath);
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            this.internalbuffer = [];
            this.writeToFile = function(content){
                fs.appendFileSync(filePath, content + '\n');
            }
            
        }
        info(...msg){
            // 增加时间戳 格式为2023-08-03 17:56:35.800
            // 立即方式
            const now = new Date();
            const timestamp = now.toLocaleString('zh-CN', { hour12: false });
            msg.unshift(timestamp);		
            this.writeToFile(util.format(...msg));
        }
        // 缓存方式
        sendlog(...msg){
            const now = new Date();
            const timestamp = now.toLocaleString('zh-CN', { hour12: false });
            msg.unshift(timestamp);
            this.internalbuffer.push(util.format(...msg));
        }
        commitlog(){
            this.writeToFile(this.internalbuffer.join('\n'));
            this.internalbuffer = [];
        }

    }
    
    return new LOGGER(logFileName);
}

module.exports = {
    logger
};