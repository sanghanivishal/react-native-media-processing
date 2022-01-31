/**
 * @author Vishal Sanghani
 * Date: 27/01/22
 */

import Media from "./media";
import {secondsToMilliseconds, timeStringToMilliseconds} from "./utils";

/**
 * Base class of audio and video media
 */

export default class AVTools extends Media {
   constructor(mediaFullPath, mediaType) {
      super(mediaFullPath, mediaType);
   }

   /**
    * Cut media file
    * @param options
    * @returns {Promise<any>}
    */
   cut = (options) => {
      return new Promise(async (resolve, reject) => {
         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'cut');
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Fetch input details in order to get video duration
         const inputDetails = await this.getDetails();
         const toDuration = timeStringToMilliseconds(options.to);
         const fromDuration = timeStringToMilliseconds(options.from);
         const duration = secondsToMilliseconds(inputDetails.duration);

         // Check for incoherence
         if (duration < toDuration) {
            reject('The option "to" can not be greater than the total time of the video');
            return;
         }

         if (duration < fromDuration) {
            reject('The option "from" can not be greater than the total time of the video');
            return;
         }

         // get resulting output file path
         const {outputFilePath} = checkInputAndOptionsResult;

         // construct final command
         const cmd = [
            "-i", this.mediaFullPath,
            "-ss", options.from,
            "-to", options.to,
            "-c", "copy",
            outputFilePath
         ]

         // execute command
         Media
            .execute(cmd)
            .then(result => resolve({outputFilePath, message: result}))
            .catch(error => reject(error));
      });
   };
}
