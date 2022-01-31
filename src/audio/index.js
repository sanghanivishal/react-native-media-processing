/**
 * @author Vishal Sanghani
 * Date: 25/01/22
 */

import AVTools from "../av-tools";
import {DEFAULT_COMPRESS_AUDIO_OPTIONS} from "../constants";

/**
 * Management of operations relating to audio processing
 */
class AudioTools extends AVTools {
   constructor(mediaPath) {
      super(mediaPath, 'audio');
   }

   /**
    * Compress audio according to parameters
    * @param options
    * @returns {Promise<any>}
    */
   compress = (options = DEFAULT_COMPRESS_AUDIO_OPTIONS) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'compress', options.extension);
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // Initialize bitrate
         let bitrate = DEFAULT_COMPRESS_AUDIO_OPTIONS.bitrate;

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath,
            "-b:a", options.bitrate ? options.bitrate : bitrate,
            "-map", "a",
            outputFilePath
         ];

         // Execute command
         AudioTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   };

   /**
    * Adjust volume of an audio
    * @param options
    * @returns {Promise<any>}
    */
   adjustVolume = (options = {}) => {
      return new Promise(async (resolve, reject) => {
         // Check if extension is present before continue
         if (options.rate === undefined) {
            reject(`Parameter rate should be set`);
            return;
         }

         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'adjustVolume');
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // group command from calculated values
         const cmd = [
            "-i", this.mediaFullPath,
            "-filter:a", `volume=${options.rate}`,
            outputFilePath
         ];

         // Execute command
         AudioTools
            .execute(cmd)
            .then(result => resolve({outputFilePath, rc: result}))
            .catch(error => reject(error));
      });
   }

}

export default AudioTools;
