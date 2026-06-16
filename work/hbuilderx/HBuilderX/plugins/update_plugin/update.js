const fs = require('fs');
const path = require('path');

// /HBuilderX.app/Contents/Frameworks/QtCore.framework/Resources/Info.plist
// Read the value of the CFBundlePackageType key from the Info.plist file
// If the value is not equal to "5.12", exit the script
const infoPlistPath = path.join(__dirname, '../../../../Frameworks/QtCore.framework/Resources/Info.plist');
const infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
const shortVersionString = infoPlist.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]*)<\/string>/)[1];
if (shortVersionString !== '5.12') {
  process.exit(1);
}

function backupAndCopy(name){

    // backup update to backup
    // script location HBuilderX.app/Contents/HBuilderX/update/patch/plugins/update_plugin
    // backup location HBuilderX.app/Contents/HBuilderX/update/backup
    const resPath = path.join(__dirname, '../../../../Resources/');
    let updaterPath = path.join(resPath, name);    
    if (fs.existsSync(name)){
        fs.copyFileSync(name, updaterPath);
    }
}

backupAndCopy("HBuilder.icns");
backupAndCopy("HBuilder-alpha.icns");

// Call the system command "touch" to create an empty file named "HBuilderX.app"
// This will create the necessary file for the backupAndCopy function to copy it to the Resources directory
// Note: This assumes that the current working directory is the same as __dirname
// Get the current working directory
const currentDir = process.cwd();
// Use regex to find the ".app" string and extract the characters from the beginning of the string up to ".app"
const regex = /^.*\.app/;
const appName = currentDir.match(regex)[0];

// Write the appName to a file named "app_name.txt" in the Resources directory
const txt = currentDir + "\n" + appName;
fs.writeFileSync('app_name.txt', txt);
// refresh icon cache
require('child_process').execSync(`touch ${appName}`);
