import HtmlWebpackPlugin from 'html-webpack-plugin';

export function buildEntries(pages, webpackDev = []){
  let entry = {};
  pages.map((page)=>{
    entry[page.key] = [
      ...webpackDev,
      page.entry
    ];
  });
  return entry;
}

export function htmlPlugin(pages){
  return pages.map((page)=>
    new HtmlWebpackPlugin({ // Create HTML files that includes references to bundled CSS and JS.
      filename: page.filename,
      template: page.template,
      chunks: page.chunks,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      inject: true
  }));
}
