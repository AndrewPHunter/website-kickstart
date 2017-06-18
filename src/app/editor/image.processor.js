import Wrapper from './image.wrapper';

/*
 * Image Processor Class to perform basic photo editing functionality
 * Inspired by excellent documentation:
 * http://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/
 * https://www.phpied.com/canvas-pixels-2-convolution-matrix/
 * https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 */
export default class Processor{

  /**
   * Adjust the brightness of an image
   * @param {ImageData} imageData the array of pixels representing the image
   * @param {number} adjustment the value ot adjust by
   * @returns {Promise.<ImageData>} the transformed array of image pixels
   */
  static adjustBrightness(imageData, adjustment){
    let image = new Wrapper(imageData);
    return new Promise(resolve=>{
      for(let pixel of image){
        let red = Processor._truncateColorChannel(pixel.red + adjustment);
        let green = Processor._truncateColorChannel(pixel.green + adjustment);
        let blue = Processor._truncateColorChannel(pixel.blue + adjustment);
        pixel.update(red, green, blue);
      }
      resolve(image.data);
    });
  }

  /**
   * Adjust the sharpness of an image
   * @param {ImageData} imageData the array of pixels representing the image
   * @param {number} adjustment the value to adjust by
   * @returns {Promise.<ImageData>} the transformed array of image pixels
   */
  static adjustContrast(imageData, adjustment){
    const contrastFactor = (259*(adjustment + 255)) / (255 *(259-adjustment));
    let image = new Wrapper(imageData);
    return new Promise(resolve=>{
      for(let pixel of image){
        let red = Processor._truncateColorChannel(contrastFactor * ((pixel.red-128) + 128));
        let green = Processor._truncateColorChannel(contrastFactor * ((pixel.green-128) + 128));
        let blue = Processor._truncateColorChannel(contrastFactor * ((pixel.blue-128) + 128));
        pixel.update(red, green, blue);
      }
      resolve(image.data);
    });
  }

  /**
   *
   * @param {ImageData} imageData the array of pixels representing the image
   * @returns {Promise.<ImageData>} the greyscale conversion of the image
   */
  static grayScale(imageData){
    let image = new Wrapper(imageData);
    return new Promise(resolve=>{
      for(let pixel of image){
        const greyScale = .2126*pixel.red + .7152*pixel.green + .0722*pixel.blue;
        pixel.red = pixel.green = pixel.blue = greyScale;
        pixel.update(pixel.red, pixel.green, pixel.blue);
      }
      resolve(image.data);
    });
  }
  /**
   *
   * @param {number} channel the specific channel value (R|G|B|A)
   * @returns {number} representing channel value bounded by 0 to 255
   * @private
   */
  static _truncateColorChannel(channel){
    if(channel < 0) return 0;
    if(channel > 255) return 255;
    return channel;
  }

}
