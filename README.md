
# react-native-media-processing

---

## Getting started

`$ npm install react-native-media-processing --save`

### Mostly automatic installation

`$ react-native link react-native-media-processing`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-media-processing` and add `RNMediaTools.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNMediaTools.a` to your project's `Build Phases`
   ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import com.rnmediatools.RNMediaToolsPackage;` to the imports at the top of the file
- Add `new RNMediaToolsPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-media-processing'
   project(':react-native-media-processing').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-media-processing/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
   compile project(':react-native-media-processing')
   ```

---

## 1 Usage

### 1.1 Image

```javascript
import {ImageTools} from 'react-native-media-processing';

// Initialize the image tool
const imageTools = new ImageTools("/local/file/path");

// Get details about the image
imageTools.getDetails().then(details => {
   console.log("Size: " + details.size);
   // Etc.
});
```

### 1.2 Audio

```javascript
import {AudioTools} from 'react-native-media-processing';

// Initialize the audio tool
const audioTools = new AudioTools("/local/file/path");

// Get details about the audio
audioTools.getDetails().then(details => {
   console.log("Size: " + details.size);
   console.log("Duration: " + details.duration);
   // Etc.
});
```

### 1.3 Video

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

// Get details about the video
videoTools.getDetails().then(details => {
   console.log("Size: " + details.size);
   console.log("Duration: " + details.duration);
   // Etc.
});
```

---

## 2 Methods available on `ImageTools`, `AudioTools` and `VideoTools`

### 2.1 filename: String

Returning the file the media given

#### Example

```javascript
const videoTools = new VideoTools("/local/file/path");

console.log("File Name:", videoTools.filename);
```

### 2.2 extension: String

Returning the extension the media given

```javascript
const videoTools = new VideoTools("/local/file/path");

console.log("File Extension:", videoTools.extension);
```

### 2.3 getDetails(): Promise

Returning the details about the media given

#### Output

The promise returns a MediaDetails that contains:

- size: number; The total length of the media in **bytes**
- format: string;
- filename: string;
- bitrate: number;
- duration: number; The total duration of media in **seconds**
- allProperties
	- format: Object;
	- streams: Array;

---

### 2.4 isInputFileCorrect(): Promise

Check if the give media is correct and valid

#### Output

The promise returns an object with following properties:

##### - isCorrect: `boolean`

Indicate whether the media is correct or not

##### - message: `string`

Contains error message when the media is incorrect

---

### 2.5 convertTo(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Convert the media to another extension

#### Input

An object with the following properties:

##### - extension: `string`

#### Output

The promise returns an object with following properties:

##### - outputFilePath: `string`

##### - message: `string`

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.convertTo({extension: ".avi"});
```

---

### 2.6 enableStatisticsCallback(CallbackFunction): Object

Enable statistics callback and follow the progress of an ongoing Media operation.


```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.enableStatisticsCallback((response)=>{
   console.log(response)
});
```

---

### 2.7 disableStatistics()

Disable statistics callback to stop listening to Media operation.

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.disableStatistics();
```

---

## 3 ImageTools

### 3.1 scale(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Resize the dimensions of image by either increasing or decreasing it by the value of `height` and `width`.

#### Input

An object with the following properties:

##### - height: `number`

##### - width: `number`

Default setting are set to

##### - height: 768

##### - width: 1024

Example

```javascript
import {ImageTools} from 'react-native-media-processing';

// Initialize the image tool
const imageTools = new ImageTools("/local/file/path");

await imageTools.scale({height: 2048, width: 1536});
```

---

### 3.2 crop(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Crop the portion of image by passing in the option parameter

#### Input

An object with the following properties:

##### - height: `number` (Crop portion height)

##### - width: `number`(Crop portion width)

##### - x: `number`(X co-ordinate)

##### - y: `number`(Y co-ordinate)

Example

```javascript
import {ImageTools} from 'react-native-media-processing';

// Initialize the image tool
const imageTools = new ImageTools("/local/file/path");

await imageTools.crop({height: 360, width: 480, x: 10, y: 10});
```

----

### 3.3 rotate(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Rotate the image by the value of `angle` (given in option parameter)

#### Input

An object with the following properties:

##### - angle: `number` (between 0° and 360°)

Example

```javascript
import {ImageTools} from 'react-native-media-processing';

// Initialize the image tool
const imageTools = new ImageTools("/local/file/path");

await imageTools.rotate({angle: 180});
```

---

## 4 AudioTools

### 4.1 compress(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

#### Input

An object that represents compression's specification. It contains:

##### - speed: `veryslow | slower | slow | medium | fast | faster | veryfast | superfast | ultrafast` (optional, default to `medium`)

##### - quality: `number` (optional, default to `18`)

***Note:*** The higher the speed, the less effective the compression is and can in some cases lead to an **opposite
effect**.

Example

```javascript
import {AudioTools} from 'react-native-media-processing';

// Initialize the audio tool
const audioTools = new AudioTools("/local/file/path");

await audioTools.compress({quality: 18, speed: "medium"});
```

---

### 4.2 adjustVolume(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Adjust the volume of audio by either increasing or decreasing it by the value of `rate`.

#### Input

An object with the following properties:

##### - rate: `number` (between 0 and 1, 0 low volume to 1 high volume)

```javascript
import {AudioTools} from 'react-native-media-processing';

// Initialize the audio tool
const audioTools = new AudioTools("/local/file/path");

// Will create a new file with volume decreased by 50% percent of its original file
await audioTools.adjustVolume({rate: 0.5});
```

---

### 4.3 cut(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Cut the media by the value of `from` time and `to` time (given in option parameter).

#### Input

An object with the following properties:

##### - from: `string` Format `hh:mm:ss`
The time at which the media cut-off will begin

##### - to: `string` Format `hh:mm:ss`
The time when the media cut-off will stop

##### - outputFilePath: `string`

Example

```javascript
import {AudioTools} from 'react-native-media-processing';

// Initialize the audio tool
const audioTools = new AudioTools("/local/file/path");

await audioTools.cut({from: "00:00:20", to: "00:00:30"});
```

---

## 5 VideoTools

### 5.1 compress(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

#### Input

An object that represents compression's specification. It contains:

##### - speed: `veryslow | slower | slow | medium | fast | faster | veryfast | superfast | ultrafast` (optional, default to `medium`)

##### - quality: `number` (optional, default to `18`)

***Note:*** The higher the speed, the less effective the compression is and can in some cases lead to an **opposite
effect**.

Example

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.compress({quality: 18, speed: "medium"});
```

---

### 5.2 extractAudio(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Extract audio from video

**Note** By default, `mp3` is used as extension

Example

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

try {
   const result = await videoTools.extractAudio();

   const extractedAudio = new AudioTools(result.outputFilePath);
   const mediaDetails = await extractedAudio.getDetails();
   console.log(mediaDetails.extension); // mp3
} catch (e) {
}
```

---

### 5.3 addWatermark(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Add watermark to the video

#### Input

An object that represents watermark's specification. It contains:

##### - position: `CENTER | TOP_LEFT | TOP_RIGHT | BOTTOM_LEFT | BOTTOM_RIGHT`

##### - opacity: `float` (between 0 and 1, 0 low opacity to 1 high opacity)

Example

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.addWatermark({position: "CENTER", opacity: 0.6, watermarksImage: "path/to/watermark/image.png"});
```

---


### 5.4 cut(options): Promise<[MediaDefaultResponse](#MediaDefaultResponse)>

Cut the media by the value of `from` time and `to` time (given in option parameter).

#### Input

An object with the following properties:

##### - from: `string` Format `hh:mm:ss`
The time at which the media cut-off will begin

##### - to: `string` Format `hh:mm:ss`
The time when the media cut-off will stop

##### - outputFilePath: `string`

Example

```javascript
import {VideoTools} from 'react-native-media-processing';

// Initialize the video tool
const videoTools = new VideoTools("/local/file/path");

await videoTools.cut({from: "00:00:20", to: "00:00:30"});
```


---

### MediaDefaultResponse

Default promise result shared with some methods. It contains:

##### - message: `string`

The status of the request which is 0 if everything went fine

##### - outputFilePath: `string`

The full path of the media created

---

## Contributing

Feel free to submit issues or pull requests.

## License

The library is released under the MIT licence. For more information see `LICENSE`.
