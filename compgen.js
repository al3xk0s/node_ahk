const fs = require('fs');
const path = require('path');

/** @param {string} p */
const toWindows = (p) => p.replace(RegExp('/', 'g'), '\\');

/** @param {string} p */
const toUnix = (p) => p.replace(RegExp('\\\\', 'g'), '/');

const args = process.argv.slice(2);

/**
 *  @param {string} current
 *  @returns {[string, string]}
*/
const splitPath = (current) => {
    const values = current.split('/');
    if(values.length === 0) return ['', ''];
    if(values.length === 1) return ['', values[0]];

    return [values.slice(0, values.length - 1).join('/'), values[values.length - 1]];
}

/**@param {string} pathValue */
const mapPath = (base, relativeBase, pathValue, currentFragment) => {
    if(!pathValue.startsWith(currentFragment)) return;

    const fullpath = path.join(base, pathValue);
    const relativePath = path.join(relativeBase, pathValue);

    const isDirectory = fs.lstatSync(fullpath).isDirectory();

    if(isDirectory) return toUnix(relativePath) + '/';

    if(!pathValue.endsWith('.js')) return;
    return toUnix(relativePath);
}

const main = () => {
    const [baseDir, current] = args;
    
    const currentPath = path.join(baseDir, toWindows(current));

    const searchPath = fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()
        ? currentPath
        : path.dirname(currentPath);    
    
    const [firstPath, lastPath] = splitPath(current);

    const res = fs.readdirSync(searchPath)
        .map(p => mapPath(searchPath, firstPath, p, lastPath))
        .filter(p => p != null)
        .map(p => p.replace(searchPath, ''));
    
    console.log(res.join(' '));
}

main();
