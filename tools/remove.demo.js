// This script removes demo app files
import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import {chalkSuccess} from './chalkConfig';

/* eslint-disable no-console */

const fileTemplates = [
  {path: './src/index.ejs', content: path.resolve(__dirname, 'template/index.default.html')},
  {path: './src/empty.spec.js', content:path.resolve(__dirname, 'template/empty.spec.js')},
  {path: './src/styles/_site.theme.scss', content:path.resolve(__dirname, 'template/_site.theme.scss')},
  {path: './src/styles/site.common.scss', content:path.resolve(__dirname, 'template/site.common.scss')}
];

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
  './tools/templates',
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
  },
  {
    path: './src/default.test.js',
    content: defaultTest
  }
];


function loadTemplates(fileTemplates){
  let tasks = [];
  return new Promise(resolve=>{
    fileTemplates.forEach((fileInfo)=>tasks.push(readFile(fileInfo)));
    Promise.all(tasks).then((fileArray)=>resolve(fileArray))
      .catch((error)=> {throw new Error(error);});
  });

}

function readFile({path, file}){
  return new Promise((resolve, reject)=>{
    fs.readFile(file, 'utf8', (error, content)=>{
      if(error) reject(error);
      return {
        path,
        content
      };
    });
  });
}


function removeFile(path){
  return new Promise((resolve, reject)=>{
    rimraf(path, error => {
      if(error) reject(error);
      resolve();
    });
  });
}

function removeDemoFiles(fileList){
  let tasks = [];
  return new Promise(resolve=>{
    fileList.forEach(path => tasks.push(removeFile(path)));
    Promise.all(tasks).then(()=>resolve())
      .catch(error=> {throw new Error(error);});
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

async function removeDemo(){
  await removeDemoFiles(pathsToRemove);
  let templates = await loadTemplates(fileTemplates);
  (filesToCreate.concat(templates)).map(file=>createFile(file));
  removePackageJsonScriptEntry('remove-demo');
}

removeDemo();

console.log(chalkSuccess('Demo app removed.'));
