const fs = require('fs');
const path = require('path');

const folderPath = '/home/admin1/projects/hpl-wallet-middleware/icrc/src/handlers/tokenHandlers';
//const folderPath = '/home/admin1/projects/hpl-wallet-middleware/icrc/src/handlers/transactionHandlers';

var codeFiles = [];
var testFiles = [];

// Read all files in the folder
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Check if it's a file (not a directory)
        if (fs.statSync(filePath).isFile()) {

            if (file == "index.ts") {
                return;
            }

            if (file.indexOf("test.ts") >= 0) {
                testFiles.push(file);
            }
            else {
                codeFiles.push(file);
            }

        }
    });

    codeFiles.forEach((file) => {
        moveFile(file, folderPath);
    });

});

function moveFile(filePath, folderPath) {
    // Get file name and extension
    const fileName = path.basename(filePath, path.extname(filePath));
    const fileExtension = path.extname(filePath);

    // Create a new folder with the file name
    const newFolderPath = path.join(folderPath, path.dirname(filePath), fileName);

    console.log(newFolderPath);

    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath); // Create the folder
    }

    // Move the file into the folder
    const newFilePath = path.join(newFolderPath, fileName + fileExtension);

    fs.rename(path.join(folderPath, filePath), newFilePath, (err) => {
        if (err) throw err;
        console.log(`Moved ${filePath} to ${newFilePath}`);
    });
}