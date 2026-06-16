const fs = require('fs');
const path = require('path');
const logger = require('./common').logger('.difflog/rollback.log');

function rollback(storeDir/* 回退的位置 */, targetDir/* 回退的目标，应该是plugins/xxxx下 */, backup /** 备份的位置 */, record/** 未完全的执行记录 */){
    // record是已经存到备份的内容，只要把record里的    
    // 1. 先把target里的文件移动到store    
    // 2. 再把backup里的文件移动到target
    logger.info(`rollback ${backup} --> ${targetDir}`);
    for(const k in record){       
        const target = path.join(targetDir, k);
        const backupfile = path.join(backup, k);
        const storefile = path.join(storeDir, k);
        const r = record[k];
        
        if(!r) 
            continue;

        logger.info(r);
        // 移动
        if(r && r.delete){ // fallback.json里标记删除，则当时的plugins里的对应文件是没有的
            // 删除这个文件或文件夹     
            logger.info(`delete ${k}`)
            // 文件必须存在
            if(fs.existsSync(target)){
                fs.renameSync(target, storefile, { recursive: true })
            }
            continue;
        }
        logger.info(`- ${k}`)
        // 文件必须存在
        if(fs.existsSync(target)){
            // 恢复到store            
            fs.renameSync(target, storefile, { recursive: true })
        }
        if(fs.existsSync(backupfile)){
            // 恢复到target
            fs.renameSync(backupfile, target, { recursive: true })
        }        
    }

}

if (module.parent == null) {
    const args = process.argv.splice(2);
    // 调试时使用
    // 获取第一个参数是目标目录
    var targetdir = args[0];
    // 第二个参数是backup目录
    var backupdir = args[1];
    // 第三个参数是未完的记录文件
    var recordfile = args[2];
    // 读取记录文件
    const record = JSON.parse(fs.readFileSync(recordfile, 'utf-8'));
    // rollback(targetdir, backupdir, record);
} else {
    // 这个文件作为模块被引入
    module.exports = rollback;
}
