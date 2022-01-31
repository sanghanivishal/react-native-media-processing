/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */
import {
   AUDIO_BITRATE,
   AUDIO_EXTENSIONS,
   DEFAULT_AUDIO_EXTENSION, DEFAULT_IMAGE_EXTENSION,
   DEFAULT_VIDEO_EXTENSION, IMAGE_EXTENSIONS,
   VIDEO_EXTENSIONS
} from "./constants";
import SPEED from "./enums/speed";
import WatermarkPosition from "./enums/watermark-position";

const {INCORRECT_INPUT_PATH} = require("./constants");
/**
 * Check if a filename is an error one
 * @param filename
 * @returns {boolean}
 */
const isFileNameError = (filename) => {
   return filename === INCORRECT_INPUT_PATH;
};

// Regex to format string time hh:mm:ss
const timeRegex = /\d\d:\d\d:\d\d/;

/**
 * Extract full file name (with extension) from file path or url
 * @param path
 * @returns {string}
 */
const getFullFilename = (path) => {
   if (typeof path === "string") {
      const array = path.split("/");
      return array.length > 1 ? array[array.length - 1] : INCORRECT_INPUT_PATH;
   }
   return INCORRECT_INPUT_PATH;
};

/**
 * Extract file name from file path or url
 * @param path
 * @returns {string}
 */
const getFilename = (path) => {
   const fullFilename = getFullFilename(path);
   if (!isFileNameError(fullFilename)) {
      const array = fullFilename.split(".");
      return array.length > 1
         ? array.slice(0, -1).join("")
         : array.join("");
   }
   return fullFilename;
};


/**
 * Extract extension from file path or url
 * @param path
 * @param type 'audio' | 'video | image'
 * @returns {string}
 */
const getExtension = (path, type) => {
   let extension;
   const fullFilename = getFullFilename(path);
   if (!isFileNameError(fullFilename)) {
      const array = fullFilename.split(".");

      // Check if array contains .something
      if (array.length > 1) {
         extension = array[array.length - 1];
         return isMediaExtensionCorrect(extension, type)
            ? extension
            : (type === "audio" ? DEFAULT_AUDIO_EXTENSION : type === "video" ? DEFAULT_VIDEO_EXTENSION : DEFAULT_IMAGE_EXTENSION);
      }

      return type === "audio" ? DEFAULT_AUDIO_EXTENSION : type === "video" ? DEFAULT_VIDEO_EXTENSION : DEFAULT_IMAGE_EXTENSION;
   }
   return extension;
};


/**
 * Check whether a given extension is valid
 * which means among known extensions
 * @param extension
 * @param type
 * @returns {boolean}
 */
const isMediaExtensionCorrect = (extension, type) => {
   if (typeof extension === "string"
      && (type === "audio" || type === "video" || type === "image")) {
      const extensionList = type === "audio" ? AUDIO_EXTENSIONS : type === "video" ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS;
      return extensionList.includes(extension.toLowerCase());
   }
   return false;
};


/**
 * Check options for various operation
 * @param options
 * @param operation
 * @param mediaType
 * @returns {{message: string, isCorrect: boolean}}
 */
const isOptionsValueCorrect = (options, operation, mediaType = "video") => {
   if (options) {
      if (typeof options !== "object") {
         return {
            isCorrect: false,
            message: "Parameter \"options\" must be an object",
         };
      }

      switch (operation) {
         case "compress":
            if (mediaType === "video") {
               if (options.quality) {
                  if (Number.isInteger(options.quality) && options.quality > 51 || options.quality < 0)
                     return {
                        isCorrect: false,
                        message: "Incorrect option \"quality\". Please provide between 0 to 50",
                     };
                  if (!Number.isInteger(options.quality))
                     return {
                        isCorrect: false,
                        message: "Incorrect option \"quality\".",
                     };
               }
               if (options.speed &&
                  !(SPEED.getStaticValueList().includes(options.speed))) {
                  return {
                     isCorrect: false,
                     message: "Incorrect option \"speed\". Please provide one of [" +
                        SPEED.getStaticValueList().map(item => `"${item}"`).join(", ") + "]",
                  };
               }
            } else if (mediaType === "audio") {
               if (options.bitrate && !AUDIO_BITRATE.includes(parseInt(options.bitrate))) {
                  return {
                     isCorrect: false,
                     message: "Incorrect option \"bitrate\". Please provide one of [" +
                        AUDIO_BITRATE.map(item => `"${item}"`).join(", ") + "]",
                  };
               }
            }
            break;
         case 'cut':
            if (!timeRegex.test(options.from)) {
               return {
                  isCorrect: false,
                  message: 'Incorrect option "from". Please provide a valid one matching hh:mm:ss'
               };
            }
            if (!timeRegex.test(options.to)) {
               return {
                  isCorrect: false,
                  message: 'Incorrect option "to". Please provide a valid one matching hh:mm:ss'
               };
            }
            break;
         case 'adjustVolume':
            if (typeof options.rate !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter rate should be a number. ${typeof options.rate} given`
               };
            }

            if (options.rate < 0) {
               return {
                  isCorrect: false,
                  message: `Parameter rate should be greater than or equal 0. Found ${typeof options.rate}`
               };
            }

            break;
         case "scale":
            if (!options.hasOwnProperty("height") || !options.hasOwnProperty("width")) {
               return {
                  isCorrect: false,
                  message: `Parameter width and height both should be passed.`,
               };
            }
            if (typeof options.width !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter width should be a number. ${typeof options.width} given`
               };
            }
            if (typeof options.height !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter height should be a number. ${typeof options.height} given`
               };
            }
            break;
         case "crop":
            if (!options.hasOwnProperty("height") || !options.hasOwnProperty("width") || !options.hasOwnProperty("x") || !options.hasOwnProperty("y")) {
               return {
                  isCorrect: false,
                  message: `Parameter width, height, x and y should be passed.`,
               };
            }
            if (typeof options.width !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter width should be a number. ${typeof options.width} given`
               };
            }
            if (typeof options.height !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter height should be a number. ${typeof options.height} given`
               };
            }
            if (typeof options.x !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter x should be a number. ${typeof options.x} given`
               };
            }
            if (typeof options.y !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter y should be a number. ${typeof options.y} given`
               };
            }
            break;
         case "rotate":
            if (!options.hasOwnProperty("angle") || typeof options.angle !== 'number') {
               return {
                  isCorrect: false,
                  message: `Parameter angle should be a number. ${typeof options.angle} given`
               };
            }
            break;
         case "addWatermark":
            if (options.position &&
               !(WatermarkPosition.getStaticKeysList().includes(options.position))) {
               return {
                  isCorrect: false,
                  message: "Incorrect option \"position\". Please provide one of [" +
                     WatermarkPosition.getStaticKeysList().map(item => `"${item}"`).join(", ") + "]",
               };
            }
            if (typeof options.opacity !== "number" || !options.opacity || options.opacity < 0 || options.opacity > 1) {
               return {
                  isCorrect: false,
                  message: `Parameter opacity should be between 0 and 1. Found ${typeof options.opacity}`,
               };
            }
            break;
         default:
            return {
               isCorrect: true,
               message: "",
            };
      }
   } else {
      return {
         isCorrect: false,
         message: `Parameter should be a object. ${typeof options} given`
      };
   }

   return {
      isCorrect: true,
      message: "",
   };
};


/**
 * Perform operation based on options and return correspondent ffmpeg setting
 * @param position: WatermarkPosition
 * @param opacity: Float
 * @returns {{"-filter_complex": string}}
 */
const getWatermarkOptionsPosition = (position, opacity) => ({ "-filter_complex": `[1]lut=a=val*${opacity}[a];[0][a]overlay=${WatermarkPosition[position]}` });


/**
 * Perform operation based on options and return correspondent ffmpeg setting
 * @param quality: QUALITY
 * @param speed: SPEED
 * @returns {{"-crf": string,"-preset": string}}
 */
const getCompressionOptionsResolution = (quality, speed) => ({
   "-crf": quality || 18, "-preset": speed || SPEED.FAST,
});


/**
 * Convert time fom string to milliseconds
 * @param time in hh:mm:ss format
 */
const timeStringToMilliseconds = (time) => {
   if (typeof time === 'string' && timeRegex.test(time)) {
      const array = time.split(':').map(i => Number(i));
      return ((array[0] * 60 * 60) + (array[1] * 60) + array[2]) * 1000;
   }

   return NaN;
};


/**
 * Convert seconds to milliseconds
 * @param duration
 * @returns {number}
 */
const secondsToMilliseconds = (duration) => {
   return parseFloat(duration) * 1000;
};


/**
 * Convert milliseconds to time
 * From stackoverflow https://stackoverflow.com/a/19700358/12458141
 * @param duration
 * @returns {string}
 */
const millisecondsToTime = (duration) => {
   let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

   hours = (hours < 10) ? "0" + hours : hours;
   minutes = (minutes < 10) ? "0" + minutes : minutes;
   seconds = (seconds < 10) ? "0" + seconds : seconds;

   return hours === "00"
      ? minutes + ":" + seconds
      : hours + ":" + minutes + ":" + seconds;
};


export {
   getFilename,
   isFileNameError,
   getExtension,
   isOptionsValueCorrect,
   getCompressionOptionsResolution,
   timeStringToMilliseconds,
   millisecondsToTime,
   secondsToMilliseconds,
   getWatermarkOptionsPosition
};
