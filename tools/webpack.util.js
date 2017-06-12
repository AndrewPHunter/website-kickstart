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

export function htmlPluginDev(pages){
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

export function htmlPluginProd(pages){
  return pages.map((page)=>
    new HtmlWebpackPlugin({ // Create HTML files that includes references to bundled CSS and JS.
      filename: page.filename,
      favicon: './src/favicon.ico',
      template: page.template,
      chunks: page.chunks,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }));
}
