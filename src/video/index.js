/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */

import AVTools from "../av-tools";
import {getCompressionOptionsResolution, getWatermarkOptionsPosition} from "../utils";
import {
   DEFAULT_COMPRESS_VIDEO_OPTIONS,
   DEFAULT_EXTRACT_AUDIO_OPTIONS,
   ERROR_WHILE_GETTING_WATERMARK_INPUT_DETAILS
} from "../constants";
import ImageTools from "../image";

class VideoTools extends AVTools {
   constructor(mediaPath) {
      super(mediaPath, "video");
   }

   /**
    * Compress video according to parameters
    * @param options
    * @returns {Promise<any>}
    */
   compress = (options = DEFAULT_COMPRESS_VIDEO_OPTIONS) => {
      return new Promise(async (resolve, reject) => {
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, "compress", options.extension);
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // get command options based of options parameters
         const result = getCompressionOptionsResolution(options.quality, options.speed);

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath.replace("file:///", "/"),
            "-c:v", "libx264",
            "-crf", result["-crf"].toString(),
            "-preset", result["-preset"],
         ];

         // Add output file as last parameter
         cmd.push(outputFilePath);

         VideoTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   };

   /**
    * Extract audio from video
    * @param options
    * @returns {Promise<any>}
    */
   extractAudio = (options = DEFAULT_EXTRACT_AUDIO_OPTIONS) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'extractAudio', options.extension);
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // construct final command
         const cmd = [
            "-i", this.mediaFullPath,
            outputFilePath
         ];

         // execute command
         VideoTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, rc: result}))
            .catch(error => reject(error));
      });
   };

   /**
    * Add watermark in video
    * @param options
    * @returns {Promise<any>}
    */
   addWatermark = (options) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'addWatermark', options.extension);
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         //Validate input watermark file
         let imageTool = new ImageTools(options.watermarksImage);
         const details = await imageTool.getDetails().catch(() => null);
         if (!details) {
            reject(details || ERROR_WHILE_GETTING_WATERMARK_INPUT_DETAILS);
            return;
         }

         // get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // get command options based on options parameters
         const result = getWatermarkOptionsPosition(options.position, options.opacity);

         // construct final command
         const cmd = [
            "-y",
            "-i", this.mediaFullPath,
            "-i", options.watermarksImage,
            "-filter_complex", result['-filter_complex'],
            "-codec:a", "copy",
            outputFilePath,
         ];

         // execute command
         VideoTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, rc: result}))
            .catch(error => reject(error));
      });
   };
}

export default VideoTools;
