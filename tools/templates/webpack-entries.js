import path from 'path';

export default [
  {
    template: path.resolve(__dirname, 'index.ejs'),
    filename:'index.html',
    key: 'home',
    entry: path.resolve(__dirname, 'index.js'), // Defining path seems necessary for this to work consistently on Windows machines.
    chunks: ['home']
  }
];
