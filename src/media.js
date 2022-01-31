/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */
import {NativeModules, NativeEventEmitter} from "react-native";

const {RNMediaProcessing} = NativeModules;
const eventLog = "RNFFmpegLogCallback";
const eventStatistics = "RNFFmpegStatisticsCallback";
const eventExecute = "RNFFmpegExecuteCallback";

import {
   getExtension,
   getFilename,
   isFileNameError,
   isOptionsValueCorrect,
   millisecondsToTime, secondsToMilliseconds,
   timeStringToMilliseconds
} from "./utils";
import {
   ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE,
   ERROR_WHILE_GETTING_INPUT_DETAILS,
   INCORRECT_OUTPUT_PATH,
} from "./constants";

/**
 * Base class of audio, video and image media
 */
export default class Media {
   constructor(mediaFullPath, mediaType) {
      this.statisticsCallback = undefined;
      // Determine whether media is an 'audio' or 'video'
      this.mediaType = mediaType;
      // Will contain media details
      this.mediaDetails = undefined;
      // Full path of current media
      this.mediaFullPath = mediaFullPath;
      // Filename of current media
      this.filename = getFilename(mediaFullPath);
      // Extension of current media
      this.extension = getExtension(mediaFullPath, mediaType);

      const reactNativeFFmpegModuleEvents = new NativeEventEmitter(RNMediaProcessing);
      reactNativeFFmpegModuleEvents.addListener(eventStatistics, statistics => {
         if (this.statisticsCallback !== undefined) {
            this.statisticsCallback(statistics);
         }
      });

      //Enabling default logging for FFmpeg
      RNMediaProcessing.enableStatisticsEvents();
      RNMediaProcessing.enableLogEvents();
   }

   /**
    * Retrieve details about a media
    * @returns {Promise<MediaDetails | null>}
    */
   getDetails = () => {
      return new Promise(async (resolve, reject) => {
         resolve(RNMediaProcessing.getMediaInformation(this.mediaFullPath));
      });
   };


   /**
    * Perform some operation in order to check options parameters
    * @param options
    * @param operation
    * @param extension
    * @param withOutputFilePath
    * @returns {Promise<{message: string, outputFilePath: string, isCorrect: boolean}|{message: string, isCorrect: boolean}>}
    */
   checkInputAndOptions = async (options, operation, extension = this.extension, withOutputFilePath = true) => {
      const defaultResult = {
         outputFilePath: "",
         isCorrect: true,
         message: "",
      };

      // Check if the media path is correct
      const _isInputFileCorrect = await this.isInputFileCorrect();
      if (!_isInputFileCorrect.isCorrect) {
         return _isInputFileCorrect;
      }

      // Check if options parameters are correct
      const _isOptionsValueCorrect = isOptionsValueCorrect(options, operation, this.mediaType);
      if (!_isOptionsValueCorrect.isCorrect) {
         return _isOptionsValueCorrect;
      }
      if (withOutputFilePath) {
         // Check if output file is correct
         let outputFilePath = undefined;
         try {
            // use default output file
            // or use new file from cache folder
            if (options.outputFilePath) {
               outputFilePath = options.outputFilePath;
               defaultResult.outputFilePath = outputFilePath;
            } else {
               outputFilePath = await RNMediaProcessing.generateFile(extension);
               defaultResult.outputFilePath = outputFilePath;
            }
            if (outputFilePath === undefined || outputFilePath === null) {
               defaultResult.isCorrect = false;
               defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
            }
         } catch (e) {
            defaultResult.isCorrect = false;
            defaultResult.message = options.outputFilePath ? INCORRECT_OUTPUT_PATH : ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE;
         } finally {
            return defaultResult;
         }
      }

      return defaultResult;
   };

   /**
    * Indicate whether input file is correct or not
    * Display error in case input file is incorrect
    * @returns {{message: string, isCorrect: boolean}}
    */
   isInputFileCorrect = async () => {
      if (isFileNameError(this.filename)) {
         return {
            isCorrect: false,
            message: this.filename, // because filename will contains the error message
         };
      }

      // Get details about input file in order to be sure that is a correct one
      const details = await this.getDetails().catch(() => null);
      if (!details) {
         return {
            isCorrect: false,
            message: details || ERROR_WHILE_GETTING_INPUT_DETAILS,
         };
      }

      return {
         isCorrect: true,
         message: "",
      };
   };

   /**
    * Run a command
    * @param command
    * @returns {Promise<{rc: number}>}
    */
   static execute = command => RNMediaProcessing.executeFFmpegWithArguments(command);

   /**
    * Cancel ongoing command
    */
   static cancel = () => RNMediaProcessing.cancel();

   /**
    * Sets a callback function to redirect FFmpeg statistics.
    * @param newCallback new statistics callback function or undefined to disable a previously defined callback
    */
   enableStatisticsCallback(newCallback) {
      this.statisticsCallback = newCallback;
   }

   /**
    * Disables statistics functionality of the library. Statistics callback will be disabled but the last received
    * statistics data will be still available.
    * Note that statistics functionality is enabled by default.
    */
   disableStatistics() {
      this.statisticsCallback = undefined;
   }

   /**
    * Convert a media from one extension to another
    * @param options
    * @returns {Promise<any>}
    */
   convertTo = (options) => {
      return new Promise(async (resolve, reject) => {
         // Check if extension is present before continue
         if (options.extension === undefined) {
            reject(`Parameter extension should be set`);
            return;
         }

         // Check input and options values
         const checkInputAndOptionsResult = await this.checkInputAndOptions(options, 'convertTo', options.extension);
         if (!checkInputAndOptionsResult.isCorrect) {
            reject(checkInputAndOptionsResult.message);
            return;
         }

         // Get resulting output file path
         let {outputFilePath} = checkInputAndOptionsResult;

         // Replace outputFilePath's extension by the given one
         outputFilePath = outputFilePath.toString().replace(/\.\w+$/, '.' + options.extension);

         // Set command
         const cmd = [
            "-i", this.mediaFullPath,
            outputFilePath
         ]

         // Execute command
         Media
            .execute(cmd)
            .then(result => resolve({outputFilePath, rc: result}))
            .catch(error => reject(error));
      });
   }
}
