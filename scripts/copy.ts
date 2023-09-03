const {copySync} = require("fs-extra");
const {resolve} = require( "path");

main(process.argv.slice(2))

function main([fromPath, toPath]) {
    const fromFolder = resolve(process.cwd(), fromPath);
    const toFolder = resolve(process.cwd(), toPath);
    console.log(`Copping from "${fromFolder}"`);
    copySync(fromFolder, toFolder, { overwrite: true });
    console.log(`Copied to: "${toFolder}"`);
}