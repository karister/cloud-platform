const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const logger = require('./common').logger('.difflog/afterpatch.log');
const rollback = require('./rollback');

// 定义函数：计算文件的 MD5 值
function md5(file) {
    const hash = crypto.createHash('md5');
    hash.update(fs.readFileSync(file));
    return hash.digest('hex');
}

function getDirs(diffdir, pluginName, arg) {

    // 有arg决定是打patch,还是还原
    if (arg == 'patch') {
        // 打patch
        let retDirs = {
            src: path.join(diffdir, pluginName, 'store'),
            backup: path.join(diffdir, pluginName, 'backup'),
            action: path.join(diffdir, pluginName, 'backup.json'),
            fallback: path.join(diffdir, pluginName, 'fallback.json'),
            progress: path.join(diffdir, pluginName, 'patch-progress.json')
        };
        return retDirs;

    } else if (arg == 'restore') {
        // 还原
        // 还原一次以后,下一次还原,实际上就是patch了
        let retDirs = {
            src: path.join(diffdir, pluginName, 'backup'),
            backup: path.join(diffdir, pluginName, 'store'),
            action: path.join(diffdir, pluginName, 'fallback.json'),
            fallback: path.join(diffdir, pluginName, 'backup.json'),
            progress: path.join(diffdir, pluginName, 'restore-progress.json')
        };
        return retDirs;
    }
    return {};
}

// 在启动前备份文件并移动文件到指定目录
// 获取第一个参数
function movepatch(args) {
    // 获取第一个参数是patch还是restore
    var arg = args[0];
    // 第二个参数是插件根目录
    var pluginsDir = args[1];
    // 第三个参数是diffDir
    var diffDir = args[2];

    // 当前目录为/HBuilderX.app/Contents/HBuilderX/plugins/hbuilderx-update
    // 获取/HBuilderX.app/Contents/HBuilderX/update/backup/diff目录
    // var diffDir = path.join(__dirname, '../../update/backup/diff');
    // 获取/HBuilderX.app/Contents/HBuilderX/plugins目录
    // var pluginsDir = path.join(__dirname, '../../plugins');
    // 同步遍历diff目录
    var files = fs.readdirSync(diffDir);
    logger.info(`read dir sync${diffDir}`);
    logger.info(files);
    // 获取每个文件夹的名称
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        // 获取每个文件夹的路径
        var filePath = path.join(diffDir, file);
        // 获取每个文件夹的信息
        var stat = fs.statSync(filePath);
        // 判断是否为文件夹
        if (stat.isFile()) {
            continue;
        }
        
        const progressfile = path.join(filePath, "progress");
        fs.writeFileSync(progressfile, `${(new Date).toLocaleString()}`);
        // 获取该文件夹下的store文件夹
        logger.info(`******** ${file} ********`);

        logger.info(`from ${filePath}`);
        logger.info(`to ${pluginsDir}/${file}`);
        
        const dirs = getDirs(diffDir, file, arg);
        console.log(dirs);
        var storeDir = dirs.src;
        // 获取backup文件夹
        var backupDir = dirs.backup;
        // 获取该文件夹下的backup.json文件
        var backupFile = dirs.action;
        // 深度遍历所有store下面的文件并与pluginsDir/file对应目录下的文件进行位置交换
        const targetDir = path.join(pluginsDir, file);
        // backupFile的格式为{"文件的相对路径":{md5:"文件的md5值"}或者{empty:true}, ...}        
        // 如果文件不存在,则将targetDir下的文件复制到storeDir下
        
        var backupJson = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
       
        // 大小写问题?
        // 记录消耗的时间
        let fallbackInfo = {};
        var start = new Date().getTime();
        let counter = 0;
        let complete = false;
        try{
            for (var key in backupJson) {            
                counter++;
                // logger.sendlog(`moveFile ${key} backup to ${backupDir}`)                 
                const onestart = new Date().getTime(); 
                // 如果移动失败，就会少一个文件           
                fallbackInfo[key] = {action:'move it'};
                const fallback = moveFile(storeDir, targetDir, key, backupDir, backupJson[key])            
                fallbackInfo[key] = fallback;
                const oneend = new Date().getTime();
                logger.sendlog(`(${oneend - onestart}ms) ${key}`);
            }
            complete = true;
        }catch(e){
            // 生成进度文件
            // 生成失败，造成不完全的内容，回滚
            logger.sendlog(`move failed.`);
            logger.sendlog(e);
            logger.sendlog(`move failed. rollback`);
            rollback(storeDir, targetDir, backupDir, fallbackInfo);
            logger.sendlog(`move failed. rollback done`);            
        }
        logger.commitlog();
        if(!complete){
            // 已经失败了,直接退出,等待下一次启动
            // 约定的特殊退出码128
            process.exit(128);
            return;
        }

        // 处理完了之后就删除
        if(fs.existsSync(progressfile)){
            fs.rmSync(progressfile);
        }
        var end = new Date().getTime();
        // 把消耗的时间保存到文件中
        // const name = `${path.basename(file)}-${path.basename(storeDir)}-${path.basename(targetDir)}-costtime.txt`;        
        logger.info(`count:${counter} total:${end - start}ms ${path.basename(storeDir)} > ${path.basename(targetDir)}`);
        if(!fs.existsSync(dirs.fallback)){ // 不存在才要生成,已经存在了就不生成了
            fs.writeFileSync(dirs.fallback, JSON.stringify(fallbackInfo, null, 4));
        }
        
        if(process.env.hxdebug){
            const newplugins = path.join(pluginsDir, '../newplugins', file);
            // 提前准备新文件放到/HBuilderX.app/Contents/HBuilderX/newplugins下
            // 测试环境下操作完成后比对文件
            
        }
    }
}


function moveFile(storeDir, targetDir, key, backup, info) {    
    // 获取storeDir下的文件
    var src = path.join(storeDir, key);
    // 获取targetDir下的文件
    var target = path.join(targetDir, key);
    var backupfile = path.join(backup, key);
    let ret = {}
    // 交换两个文件的位置
    // 如果temp目录不存在则先创建目录
    if (!fs.existsSync(backup)) {
        // mkdirp.sync(backup);
        fs.mkdirSync(backup, { recursive: true });
    }
    // 先保证src和target的目录都存在
    if (!fs.existsSync(path.dirname(src))) {
        // mkdirp.sync(path.dirname(src));
        fs.mkdirSync(path.dirname(src), { recursive: true });
    }
    if (!fs.existsSync(path.dirname(target))) {
        // mkdirp.sync(path.dirname(target));
        fs.mkdirSync(path.dirname(target), { recursive: true });
    }

    if (!fs.existsSync(path.dirname(backupfile))) {
        // mkdirp.sync(path.dirname(backupfile));
        fs.mkdirSync(path.dirname(backupfile), { recursive: true });
    }

    // 将target文件移动到backup目录下
    // target就是pluginsDir/file目录下的文件
    // 如果target存在,则移动到backup目录下
    // 如果target不存在,需要标记一下,源文件不存在
    if (fs.existsSync(target)) {                
        if(fs.existsSync(backupfile)){
            if(fs.statSync(backupfile).isDirectory()){
                fs.rmdirSync(backupfile, { recursive: true });
            }else{                
                fs.rmSync(backupfile, { recursive: true });
            }
        }        
        // 生成md5值
        if(fs.statSync(target).isFile()){
            ret.md5 = md5(target);
        }else{
            ret.dir = true;
        }
        // rename过去,再获取md5值可能存在指向文件不存在的情况
        // 这时候获取md5值会报错,
        // 所以先获取md5值,再rename过去
        fs.renameSync(target, backupfile);
        
        
    } else {
        logger.info(`target ${key} not exist`);
        // 标记源文件不存在,fallback的时候要方向操作
        ret = {delete: true};
    }

    // 将src文件移动到temp目录下
    // 如果标记了删除,则不需要移动
    if (fs.existsSync(src)) {     
        // target的已经备份了,使用的rename,如果这里没有移动走
        // 可能是有问题的,所以这里先删除   
        if(fs.existsSync(target)){
            fs.rmSync(target, { recursive: true });
        }
        // 标记着是要删除的,那么就移动src到target
        if(info && !info.delete){
            fs.renameSync(src, target);
        }
    } else {
        // 如果src不存在,则需要标记一下
        // 文件(有md5)
        if(info.md5){
            // 那么这个文件遗失了，
            // 需要整个回滚
            throw new Error(`missing file ${key}`);				
        }
        // 检查下级目录
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
            // 获取target的父目录
            let parent = target;
            while (parent != targetDir) {
                // 如果target是个文件夹,而文件夹中没有任何东西,则删除该文件夹
                if (fs.existsSync(parent) && fs.statSync(parent).isDirectory()) {
                    fs.rmdirSync(parent, { recursive: true });
                }
                parent = path.dirname(parent);
            }
        }
    }
    return ret;
}


// 考虑执行到一半的情况
// 获取第一个参数
var args = process.argv.splice(2);

movepatch(args); 
