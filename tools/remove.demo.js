// This script removes demo app files
import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import {chalkSuccess} from './chalkConfig';

/* eslint-disable no-console */

const fileTemplates = [
  {path: './src/index.ejs', file: path.resolve(__dirname, 'templates/index.default.html')},
  {path: './src/empty.spec.js', file:path.resolve(__dirname, 'templates/empty.spec.js')},
  {path: './src/styles/_site.theme.scss', file:path.resolve(__dirname, 'templates/_site.theme.scss')},
  {path: './src/styles/site.common.scss', file:path.resolve(__dirname, 'templates/site.common.scss')},
  {path: './src/webpack-entries.js', file:path.resolve(__dirname, 'templates/webpack-entries.js')}
];

const pathsToRemove = [
  './src/favicon.ico',
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
    path: './src/index.js',
    content: '// Set up your application entry point here...'
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
      resolve({
        path,
        content
      });
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
  let templates = await loadTemplates(fileTemplates);
  await removeDemoFiles(pathsToRemove);
  (filesToCreate.concat(templates)).map(file=>createFile(file));
  removePackageJsonScriptEntry('remove-demo');
  console.log(chalkSuccess('Demo app removed.'));
}

removeDemo();


