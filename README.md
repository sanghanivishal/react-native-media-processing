
# react-native-media-processing

## Getting started

`$ npm install react-native-media-processing --save`

### Mostly automatic installation

`$ react-native link react-native-media-processing`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-media-processing` and add `RNMediaProcessing.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNMediaProcessing.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.rnmediaprocessing.RNMediaProcessingPackage;` to the imports at the top of the file
  - Add `new RNMediaProcessingPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-media-processing'
  	project(':react-native-media-processing').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-media-processing/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-media-processing')
  	```


## Usage
```javascript
import RNMediaProcessing from 'react-native-media-processing';

// TODO: What to do with the module?
RNMediaProcessing;
```
  