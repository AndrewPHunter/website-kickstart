/**
 * Utility Wrapper to perform common looping functionality
 */
class Wrapper{

  /**
   * Create a wrapper for image data
   * @param {ImageData} imageData representing image information from canvas object
   */
  constructor(imageData){
    this._imageData = imageData;
    this._imagePixels = imageData.data;
    this._length = imageData.data.length;
  }

  get data(){
    return this._imageData;
  }

  *[Symbol.iterator](){
    for(let channel = 0; channel < this._length; channel+=4){
      yield {
        red: this._imagePixels[channel],
        green: this._imagePixels[channel+1],
        blue: this._imagePixels[channel+2],
        alpha: this._imagePixels[channel+3],
        update: (red, green, blue, alpha = this._imagePixels[channel+3])=>{
          this._imagePixels[channel] = red;
          this._imagePixels[channel+1] = green;
          this._imagePixels[channel+2] = blue;
          this._imagePixels[channel+3] = alpha;
        }
      };
    }
  }
}


export default Wrapper;
