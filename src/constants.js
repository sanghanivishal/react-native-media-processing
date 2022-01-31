/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */
import SPEED from "./enums/speed";

const INCORRECT_INPUT_PATH = "Invalid path. Please provide a valid path";
const INCORRECT_OUTPUT_PATH = 'Incorrect output path. Please provide a valid one';
const ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE = 'An error occur while generating output file';
const ERROR_WHILE_GETTING_INPUT_DETAILS = 'An error occur while getting input file details. Please check your input file details';
const ERROR_WHILE_GETTING_WATERMARK_INPUT_DETAILS = "An error occur while getting watermark file details. Please check your input file details";

const DEFAULT_COMPRESS_VIDEO_OPTIONS = {
   quality: 18,
   speed: SPEED.MEDIUM,
};

const DEFAULT_COMPRESS_AUDIO_OPTIONS = {
   bitrate: 96
};
const DEFAULT_SCALE_IMAGE_OPTIONS = {
   width: 1024,
   height: 768
};

const AUDIO_BITRATE = [512, 480, 320, 256, 192, 160, 128, 96, 64, 32];

const DEFAULT_AUDIO_EXTENSION = 'mp3';
const DEFAULT_VIDEO_EXTENSION = 'mp4';
const DEFAULT_IMAGE_EXTENSION = 'jpg';

const DEFAULT_EXTRACT_AUDIO_OPTIONS = {
   extension: DEFAULT_AUDIO_EXTENSION,
};

const AUDIO_EXTENSIONS = [
   "wav",
   "bwf",
   "raw",
   "aiff",
   "flac",
   "m4a",
   "pac",
   "tta",
   "wv",
   "ast",
   "aac",
   "mp2",
   "mp3",
   "mp4",
   "amr",
   "s3m",
   "3gp",
   "act",
   "au",
   "dct",
   "dss",
   "gsm",
   "m4p",
   "mmf",
   "mpc",
   "ogg",
   "oga",
   "opus",
   "ra",
   "sln",
   "vox"
];

const VIDEO_EXTENSIONS = [
   "3g2",
   "3gp",
   "aaf",
   "asf",
   "avchd",
   "avi",
   "drc",
   "flv",
   "m2v",
   "m4p",
   "m4v",
   "mkv",
   "mng",
   "mov",
   "mp2",
   "mp4",
   "mpe",
   "mpeg",
   "mpg",
   "mpv",
   "mxf",
   "nsv",
   "ogg",
   "ogv",
   "qt",
   "rm",
   "rmvb",
   "roq",
   "svi",
   "vob",
   "webm",
   "wmv",
   "yuv"
];

const IMAGE_EXTENSIONS = [
   "jpg",
   "jpeg",
   "png",
   "bmp"
]

export {
   INCORRECT_INPUT_PATH,
   DEFAULT_COMPRESS_VIDEO_OPTIONS,
   DEFAULT_AUDIO_EXTENSION,
   DEFAULT_VIDEO_EXTENSION,
   AUDIO_EXTENSIONS,
   VIDEO_EXTENSIONS,
   ERROR_WHILE_GETTING_INPUT_DETAILS,
   INCORRECT_OUTPUT_PATH,
   ERROR_OCCUR_WHILE_GENERATING_OUTPUT_FILE,
   AUDIO_BITRATE,
   DEFAULT_COMPRESS_AUDIO_OPTIONS,
   DEFAULT_EXTRACT_AUDIO_OPTIONS,
   IMAGE_EXTENSIONS,
   DEFAULT_SCALE_IMAGE_OPTIONS,
   DEFAULT_IMAGE_EXTENSION,
   ERROR_WHILE_GETTING_WATERMARK_INPUT_DETAILS
};
