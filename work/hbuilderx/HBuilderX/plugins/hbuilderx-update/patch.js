const fs = require('fs');
const crypto = require('crypto');
const {
	spawnSync
} = require('child_process');
const path = require('path');
const { chdir } = require('process');

const logger = require('./common').logger('.difflog/patch.log');

let UpdaterBin = "Updater";
// UpdaterBin = "../../../updatepatch";
if (process.platform === "win32") {
	// 如果是windows平台
	UpdaterBin = "Updater.exe";
}

function patchFiles(argv) {
	const srcDir = argv[0]; // 源目录,这个目录下的文件不修改
	const backupDir = argv[1]; // 替换目标文件夹,操作后的文件存在这个目录
	// HBuilderX.app/Contents/HBuilderX/update/patch/diff/hbuilderx-language-services
	const workDir = argv[2]; // 对应的工作目录
	logger.info(` --------- patchfiles ---------`);
	logger.info(`${srcDir} ==> ${backupDir} ==> ${workDir}`);

	if (!fs.existsSync(srcDir)) { // 如果旧目录不存在
		logger.info(srcDir);
		logger.info("Error: Old directory does not exist"); // 给出错误提示
		return;
	}

	const store = path.join(backupDir, "store"); // 定义备份存储目录
	
	// 保存不同的文件
	if (!fs.existsSync(store)) {
		try {
			fs.mkdirSync(store, { recursive: true });
			logger.info('dir created successfully');
		} catch (err) {
			logger.info(err)
		}
	}

	const workspaceDir = path.join(workDir, "workspace"); // 定义工作区目录
	const backupRecord = path.join(backupDir, "backup.json");
	const workFilePath = path.join(workDir, "work.json"); // 定义工作路径

	// let patchOutput = fs.openSync(path.join(workDir, "patchOutput.txt"), 'w+');
	// 定义函数：计算文件的 MD5 值
	function md5(file) {
		const hash = crypto.createHash('md5');
		hash.update(fs.readFileSync(file));
		return hash.digest('hex');
	}

	// 定义函数：更新文件
	function update_file(file_path, file_info, backup) {
		logger.info(`update ${file_path}`);
		const patch_file_path = path.join(workspaceDir, file_info['path']);
		const src_file_path = path.join(srcDir, file_path);
		const new_file_path = path.join(store, file_path);
		const dir_path = path.dirname(new_file_path);
		// 如果目录不存在，则创建目录
		if (!fs.existsSync(dir_path)) {
			logger.info(`${dir_path} not exists, create`);
			fs.mkdirSync(dir_path, {
				recursive: true
			});
		}

		// 如果文件不存在，则发出警告
		if (!fs.existsSync(patch_file_path)) {
			logger.info(`Patch file not found for ${file_path}`);
			return;
		}
		// 本来应该存在的文件不存在，则发出警告
		if (!fs.existsSync(src_file_path)) {
			logger.info(`Old file not found for ${file_path}`);
			return;
		}
		// 记录的文件，在回滚的时候需要
		backup[file_path] = { md5: md5(src_file_path) }; // 记录到backup.json中
		logger.info(`${UpdaterBin} patch ${src_file_path} ${new_file_path} ${patch_file_path}`);
		let code = 0;

		try {
			// Updater已经在env中配置好了
			// 复制文件的stat信息
			// fs.writeFileSync(patchOutput, `\n patch ${src_file_path} ${new_file_path} ${patch_file_path}\n`);
			spawnSync(UpdaterBin, ["patch", src_file_path, new_file_path, patch_file_path],
				{ env: process.env }
			);
			
			// 写入文件的stat信息
			// fs.writeFileSync(new_file_path, JSON.stringify(s))
		} catch (err) {
			logger.info(`Failed to execute bspatch: ${err}`);
		}

		logger.info(`return code ${code}`);
		logger.info(`check md5: ${new_file_path}`);
		const new_file_md5 = md5(new_file_path);
		logger.info(`md5: ${new_file_md5}`);
		if ('md5' in file_info) {
			if (new_file_md5 !== file_info['md5']) {
				logger.info(`MD5 mismatch for ${file_path} ${new_file_md5} != ${file_info['md5']}`);
				// 如果 MD5 值不匹配，则发出错误
				// 发出异常
				throw new Error(`MD5 mismatch for ${file_path} ${new_file_md5} != ${file_info['md5']}`);				
			}else{
				logger.info(`MD5 valid for ${file_path} ${new_file_md5} == ${file_info['md5']}`);
			}
		} else {
			logger.info(`No MD5 provided for ${file_path}`);
		}

	}

	// 定义函数：创建文件
	function create_file(file_path, file_info, delayactions = [], backup) {
		// 复制文件,如果是zip文件则解压
		const src_file_path = path.join(srcDir, file_path);
		const file_source = path.join(workspaceDir, file_path);
		const new_file_path = path.join(store, file_path);

		logger.info(`create file ${JSON.stringify(file_info)} ==> ${file_path} --> ${new_file_path}`);

		// 如果是 zip 文件，则解压
		if ('path' in file_info && file_info.path.endsWith('.zip')) {
			
		} else {
			if ('linkto' in file_info) {
				logger.info(`link -- ${new_file_path} linkto:${file_info.linkto}`);
				// 插入delayactions
				delayactions.push({
					"action": "link",
					"linkto": file_info.linkto,
					"linkfrom": file_path
				});
				return;
			}
			if (fs.existsSync(file_source)) {
				if (!fs.existsSync(path.dirname(new_file_path))) {
					fs.mkdirSync(path.dirname(new_file_path), {
						recursive: true
					});
				}
				if ('md5' in file_info) {
					const file_md5 = md5(file_source);
					// 如果 MD5 值不匹配，则发出错误
					// 停止运行
					if (file_md5 !== file_info.md5) {
						logger.info(
							`MD5 mismatch for ${file_path} ${file_md5} != ${file_info.md5}`); // 如果 MD5 值不匹配，则发出错误
						return;
					}
				}
				// 如果已经存在了,先删除
				if (fs.existsSync(new_file_path)) {
					if (fs.statSync(new_file_path).isDirectory()) {
						fs.rmdirSync(new_file_path, { recursive: true });
					} else {
						fs.unlinkSync(new_file_path);
					}
				}
				logger.info(`rename ${file_source} --> ${new_file_path}`);
				// mac 下使用mv,fs的rename会把symbole识别成指向的文件
				if(process.platform === 'win32'){
					fs.renameSync(file_source, new_file_path);
				}else{
					spawnSync('mv', [file_source, new_file_path]);
				}

				if (fs.existsSync(src_file_path)) {
					if (fs.lstatSync(src_file_path).isDirectory()) {
						backup[file_path] = { path: file_path }; // 本来就是没有的
					} else {
						backup[file_path] = { md5: md5(src_file_path) }; // 记录到backup.json中)			
					}
				} else {
					backup[file_path] = { empty: true }; // 本来就是没有的
					// fs.rmSync(new_file_path, { recursive: true })
				}
			} else {
				// 不存在的文件,有可能是link				
				logger.info(`not exists ${file_source}`);
			}
		}
	}

	function deleteFile(file_path, backup) {		
		logger.info(`delete ${file_path}`);
		const target_file_path = path.join(store, file_path);
		logger.info(`delete ${target_file_path}`);
		// 不需要在store中生成任何文件
		// 如果是目录
		if (fs.existsSync(target_file_path)) {
			if (fs.lstatSync(target_file_path).isDirectory) {
				// traverseDirectory(srcDir, target_file_path, backup);
				backup[file_path] = { delete: true };
				logger.info(`delete dir ${target_file_path}`)
				// fs.rmSync(target_file_path, { recursive: true });
			} else {
				logger.info(`delete file ${target_file_path}`);
				backup[file_path] = { md5: md5(target_file_path), delete: true };
				// fs.rmSync(target_file_path, { recursive: true })

			}
		} else {
			backup[file_path] = { delete: true };
			logger.info(`not exists ${target_file_path}`);
		}
	}

	// 主函数
	// 打开work_file_path文件并获取json内容赋值到work	
	const work = JSON.parse(fs.readFileSync(workFilePath));
	let backup = {};
	if (fs.existsSync(backupRecord)) {
		backup = JSON.parse(fs.readFileSync(backupRecord));
	}
	// 循环work的每一个对象

	delayactions = [];
	for (const file_path in work) {
		const file_info = work[file_path]
		if (file_info.kind === "create") {
			create_file(file_path, file_info, delayactions, backup);
		} else if (file_info.kind === "delete") {
			deleteFile(file_path, backup);
		} else if (file_info.kind === "copy") {
			// copy_file(file_path);
		} else if (file_info.kind === "update") {
			update_file(file_path, file_info, backup)
		} else {
			if (file_info.kind === "same") {
			} else {
				logger.info(`Unknown operation for ${file_path} - ${file_info.kind}`); // 将警告写入logging
			}
		}
		// logger.info(`done ${file_info.kind} ==> ${file_path}`);
	}
	logger.info(`finish working`);
	logger.info(`delayaction`)
	// 保存delayactions到文件	
	fs.writeFileSync(path.join(backupDir, "links.json"), JSON.stringify(delayactions, null, 2));
	// 处理delayactions

	// afterpatch.js处理links
	delayactions = [];

	const cwd = process.cwd();
	for (const action of delayactions) {
		chdir(store);
		logger.info(action);
		// action.linkto =path.resolve('/Users/bo-m1/Projects/HBuilderBuildScript/hx_build_script/hx-upgrade-patch/playground/working/uniapp-cli-vite.3.8.1-2023042611_uniapp-cli-vite.3.8.2-2023051014',)

		if (action.action === "link") {
			if (fs.existsSync(action.linkfrom)) {
				logger.info(`exists link ${action.linkfrom}`); // 如果文件类型未知，则发出警告
				fs.unlinkSync(action.linkfrom);
			}
			// 获取当前文件的目录

			const dir = path.dirname(action.linkfrom);
			logger.info(`target ${dir}`)
			// 创建目录
			if (!fs.existsSync(dir)) {
				logger.info(`create dir ${dir}`)
				fs.mkdirSync(dir, {
					recursive: true
				});
			}
			logger.info(`enter ${dir}`)
			// 进入当前目录
			chdir(dir);
			const linkto = path.join(dir, action.linkto);
			const linkname = path.basename(action.linkfrom);
			logger.info(`linkto ${linkto} \n linkname ${linkname}`)
			// 如果linkto不存在
			if (!fs.existsSync(linkto)) {
				logger.info(`linkto ${linkto} not exists`); // 如果文件类型未知，则发出警告
				continue;
			}
			logger.info(`link ${linkto}(${action.linkto}) to ${action.linkfrom}`); // 如果文件类型未知，则发出警告
			if (fs.existsSync(linkname)) {
				logger.info(`exists link ${linkname}`); // 如果文件类型未知，则发出警告
				fs.unlinkSync(linkname);
			}
			try {
				// 在windows下使用命令行mklink /H 制作硬链接
				// 否则会遇到权限问题
				if (process.platform === 'win32') {
					// windows下不需要处理link,
					// 插件已经按平台特性处理成xxxx.cmd
					// const { stderr } = spawnSync('cmd', ["/c", 'mklink', '/h', linkname, linkto]);
					// const code = stderr.toString('utf-8');
					// logger.info('window:mklink::ret code:', code);
				} else {
					// fs.symlinkSync(action.linkto, action.linkfrom);
					const { stderr } = spawnSync('ln', ['-s', linkto, linkname]);
					if (stderr) {
						const code = stderr.toString('utf-8');
						logger.info('mac:ln::ret code:', code);
					}
				}
			} catch (error) {
				logger.info(action.linkfrom);
				logger.info(error);
			}
		}
	}
	logger.info('finish delayactions');

	// backupRecord内容写入文件
	chdir(cwd);
	logger.info(`write file ${backupRecord}`);
	fs.writeFileSync(backupRecord, JSON.stringify(backup, null, 2));
	logger.info('write file backup.json success');
	// fs.closeSync(patchOutput);
}

if (process.argv.length < 4) { // 如果输入的参数不足
	console.log("Usage: node patchfile.js <old_dir> <new_dir> <workdir>"); // 显示用法
} else { // 否则
	patchFiles(process.argv.slice(2)); // 调用patchFiles(第一个参数)
}