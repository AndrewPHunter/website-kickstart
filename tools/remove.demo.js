// This script removes demo app files
import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import {chalkSuccess} from './chalkConfig';


const defaultIndex = fs.readFileSync(path.resolve(__dirname,'index.default.html'), 'utf8');

/* eslint-disable no-console */

const pathsToRemove = [
  './src/about/*',
  './src/app',
  './src/components',
  './src/static/*',
  './src/styles/*',
  './src/favicon.ico',
  './src/index.js',
  './src/index.style.scss',
  './src/webpack-entries.js',
  './tools/remove.demo.js',
];

const filesToCreate = [
  {
    path: './src/index.ejs',
    content:defaultIndex,
  },
  {
    path: './src/index.js',
    content: '// Set up your application entry point here...'
  },
  {
    path: './src/styles/_site.theme.scss',
    content: '//Override any of the bootstrap variables here to customize your site theme https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_variables.scss'
  },
  {
    path: './src/webpack-entries.js',
    content: '//setup your entry points here...\n import path from \'path\';\n export default [\n];'
  }
];

function removePath(path, callback) {
  rimraf(path, error => {
    if (error) throw new Error(error);
    callback();
  });
}

function createFile(file) {
  fs.writeFile(file.path, file.content, error => {
    if (error) throw new Error(error);
  });
}

function removePackageJsonScriptEntry(scriptName) {
  const packageJsonPath = './package.json';
  let fileData = fs.readFileSync(packageJsonPath);
  let content = JSON.parse(fileData);
  delete content.scripts[scriptName];
  fs.writeFileSync(packageJsonPath,
    JSON.stringify(content, null, 2) + '\n');
}

let numPathsRemoved = 0;
pathsToRemove.map(path => {
  removePath(path, () => {
    numPathsRemoved++;
    if (numPathsRemoved === pathsToRemove.length) { // All paths have been processed
      // Now we can create files since we're done deleting.
      filesToCreate.map(file => createFile(file));
    }
  });
});

removePackageJsonScriptEntry('remove-demo');

console.log(chalkSuccess('Demo app removed.'));
