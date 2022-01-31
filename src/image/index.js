/**
 * @author Vishal Sanghani
 * Date: 29/01/22
 */

import Media from "../media";
import {DEFAULT_SCALE_IMAGE_OPTIONS} from "../constants";

/**
 * Management of operations relating to image processing
 */
class ImageTools extends Media {
   constructor(mediaPath) {
      super(mediaPath, 'image');
   }

   /**
    * Scale image according to parameters
    * @param options
    * @returns {Promise<any>}
    */
   scale = (options = DEFAULT_SCALE_IMAGE_OPTIONS) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'scale');
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath,
            "-vf", `scale=${options.width}:${options.height}`,
            outputFilePath
         ];

         // Execute command
         ImageTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   }

   /**
    * Crop image according to parameters
    * @param options
    * @returns {Promise<any>}
    */
   crop = (options = {}) => {
      return new Promise(async (resolve, reject) => {
         // Validate option with original media
         const validCropOptions = await this.validateCropOptions(options)
         if (!validCropOptions.isValid) {
            reject(validCropOptions.message);
            return;
         }

         // Get resulting output file path
         const {outputFilePath} = validCropOptions;

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath,
            "-vf", `crop=${options.width}:${options.height}:${options.x}:${options.y}`,
            outputFilePath
         ];

         // Execute command
         ImageTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   }

   /**
    * Rotate image according to parameters
    * @param options
    * @returns {Promise<any>}
    */
   rotate = (options = {}) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'rotate');
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath,
            "-vf", `rotate=angle=${options.angle}*PI/180`,
            outputFilePath
         ];

         // Execute command
         ImageTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   }

   /**
    * Perform some operation in order to check options parameters are valid
    * @param options
    * @returns {Promise<{message: string, outputFilePath: string, isValid: boolean}|{message: string, isValid: boolean}>}
    */
   validateCropOptions = async (options = {}) => {
      // Check input and options values
      const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'crop');
      if (!checkInputAndOptionsResult.isCorrect) {
         return {
            isValid: false,
            message: checkInputAndOptionsResult.message
         }
      }

      // Get details about input file in order to be validate options
      const details = await this.getDetails();

      //Get width and height of original image
      const {width, height} = details.allProperties.streams[0];

      //Check if new width is not more then original width
      if (options.width > width) {
         return {
            isValid: false,
            message: `Parameter width is greater than image width ${width}.`,
         };
      }

      //Check if new height is not more then original height
      if (options.height > height) {
         return {
            isValid: false,
            message: `Parameter height is greater than image height ${height}.`,
         };
      }

      return {
         isValid: true,
         outputFilePath: checkInputAndOptionsResult.outputFilePath,
         message: "Parameter are valid.",
      };
   }
}

export default ImageTools;
