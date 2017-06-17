import path from 'path';

export default [
  {
    template: path.resolve(__dirname, 'index.ejs'),
    filename:'index.html',
    key: 'home',
    entry: path.resolve(__dirname, 'index.js'), // Defining path seems necessary for this to work consistently on Windows machines.
    chunks: ['home']
  },
  {
    template: path.resolve(__dirname, 'about/index.ejs'),
    filename:'about/index.html',
    key: 'about',
    entry: path.resolve(__dirname, 'about/about.js'),
    chunks: ['about']
  },
  {
    template: path.resolve(__dirname, 'app/index.ejs'),
    filename: 'app/index.html',
    key: 'app',
    entry: path.resolve(__dirname, 'app/index.js'),
    chunks: ['app']
  }
];
