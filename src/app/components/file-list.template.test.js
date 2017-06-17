import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars/dist/handlebars';

const fileString = fs.readFileSync(path.join(__dirname, 'file-list.template.ejs'));
const template = (cheerio.load(fileString))('#file-list').html();
const templateFunction = handlebars.compile(template);

describe("file-list.template should", ()=>{

  it("should return an unordered list", ()=>{
    const $ = cheerio.load(templateFunction());
    const expected = $('ul').length;
    expect(expected).toBe(1);
  });

  it("should render all elements in provided object", ()=>{
    const fileList = [
      {name:'test', data:1234, objectUrl: 34565},
      {name:'test2', data:1234, objectUrl: 34565},
      {name:'test3', data:1234, objectUrl: 34565},
    ];

    const $ = cheerio.load(templateFunction({list: fileList}));
    const expected = $('ul').find('li').length;

    expect(expected).toBe(fileList.length);
  });

});
