
package com.rnmediaprocessing;

import com.arthenica.mobileffmpeg.Config;
import com.arthenica.mobileffmpeg.ExecuteCallback;
import com.arthenica.mobileffmpeg.FFmpeg;
import com.arthenica.mobileffmpeg.FFprobe;
import com.arthenica.mobileffmpeg.Level;
import com.arthenica.mobileffmpeg.LogCallback;
import com.arthenica.mobileffmpeg.LogMessage;
import com.arthenica.mobileffmpeg.MediaInformation;
import com.arthenica.mobileffmpeg.Statistics;
import com.arthenica.mobileffmpeg.StatisticsCallback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Callback;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import java.util.Iterator;

public class RNMediaProcessingModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public static final String KEY_STAT_EXECUTION_ID = "executionId";
  public static final String KEY_STAT_TIME = "time";
  public static final String KEY_STAT_SIZE = "size";
  public static final String KEY_STAT_BITRATE = "bitrate";
  public static final String KEY_STAT_SPEED = "speed";
  public static final String KEY_STAT_VIDEO_FRAME_NUMBER = "videoFrameNumber";
  public static final String KEY_STAT_VIDEO_QUALITY = "videoQuality";
  public static final String KEY_STAT_VIDEO_FPS = "videoFps";

  public static final String EVENT_LOG = "RNFFmpegLogCallback";
  public static final String EVENT_STAT = "RNFFmpegStatisticsCallback";
  public static final String EVENT_EXECUTE = "RNFFmpegExecuteCallback";

  public static final String KEY_LOG_EXECUTION_ID = "executionId";
  public static final String KEY_LOG_MESSAGE = "message";
  public static final String KEY_LOG_LEVEL = "level";

  public RNMediaProcessingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNMediaProcessing";
  }

  @ReactMethod
  public void generateFile(String extension, Promise promise) {
    try {
      File outputDir = reactContext.getCacheDir();

      final String outputUri = String.format("%s/%s." + extension, outputDir.getPath(), UUID.randomUUID().toString());

      promise.resolve(outputUri);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void getMediaInformation(String path, Promise promise) {
    try {
      MediaInformation info = FFprobe.getMediaInformation(path);
      WritableMap resultData = new WritableNativeMap();

      resultData.putString("bitrate", info.getBitrate());
      resultData.putString("duration", info.getDuration());
      resultData.putString("filename", info.getFilename());
      resultData.putString("format", info.getFormat());
      resultData.putString("size", info.getSize());
      try {
        resultData.putMap("allProperties", convertJsonToMap(info.getAllProperties()));
      } catch (JSONException e) {
        e.printStackTrace();
      }
      promise.resolve(resultData);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }

  }

  @ReactMethod
  public void executeFFmpegWithArguments(final ReadableArray readableArray, final Promise promise) {
    final RNFFmpegExecuteFFmpegAsyncArgumentsTask asyncTask = new RNFFmpegExecuteFFmpegAsyncArgumentsTask(promise, readableArray);
    asyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
  }

  @ReactMethod
  public void enableLogEvents() {
    Config.enableLogCallback(new LogCallback() {

      @Override
      public void apply(final LogMessage logMessage) {
        emitLogMessage(logMessage);
      }
    });
  }

  @ReactMethod
  public void disableLogEvents() {
    Config.enableLogCallback(null);
  }

  @ReactMethod
  public void enableStatisticsEvents() {
    Config.enableStatisticsCallback(new StatisticsCallback() {

      @Override
      public void apply(final Statistics statistics) {
        emitStatistics(statistics);
      }
    });
  }

  @ReactMethod
  public void disableStatisticsEvents() {
    Config.enableStatisticsCallback(null);
  }

  protected void emitLogMessage(final LogMessage logMessage) {
    final DeviceEventManagerModule.RCTDeviceEventEmitter jsModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    final WritableMap logMap = Arguments.createMap();

    logMap.putDouble(KEY_LOG_EXECUTION_ID, logMessage.getExecutionId());
    logMap.putInt(KEY_LOG_LEVEL, levelToInt(logMessage.getLevel()));
    logMap.putString(KEY_LOG_MESSAGE, logMessage.getText());

    jsModule.emit(EVENT_LOG, logMap);
  }

  protected void emitStatistics(final Statistics statistics) {
    final DeviceEventManagerModule.RCTDeviceEventEmitter jsModule = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    jsModule.emit(EVENT_STAT, toMap(statistics));
  }

  public static WritableMap toMap(final Statistics statistics) {
    final WritableMap statisticsMap = Arguments.createMap();

    if (statistics != null) {
      statisticsMap.putDouble(KEY_STAT_EXECUTION_ID, statistics.getExecutionId());
      statisticsMap.putInt(KEY_STAT_TIME, statistics.getTime());
      statisticsMap.putDouble(KEY_STAT_SIZE, statistics.getSize());
      statisticsMap.putDouble(KEY_STAT_BITRATE, statistics.getBitrate());
      statisticsMap.putDouble(KEY_STAT_SPEED, statistics.getSpeed());
      statisticsMap.putInt(KEY_STAT_VIDEO_FRAME_NUMBER, statistics.getVideoFrameNumber());
      statisticsMap.putDouble(KEY_STAT_VIDEO_QUALITY, statistics.getVideoQuality());
      statisticsMap.putDouble(KEY_STAT_VIDEO_FPS, statistics.getVideoFps());
    }

    return statisticsMap;
  }

  public WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
    WritableMap map = new WritableNativeMap();

    Iterator<String> iterator = jsonObject.keys();
    while (iterator.hasNext()) {
      String key = iterator.next();
      Object value = jsonObject.get(key);
      if (value instanceof JSONObject) {
        map.putMap(key, convertJsonToMap((JSONObject) value));
      } else if (value instanceof JSONArray) {
        map.putArray(key, convertJsonToArray((JSONArray) value));
        if (("option_values").equals(key)) {
          map.putArray("options", convertJsonToArray((JSONArray) value));
        }
      } else if (value instanceof Boolean) {
        map.putBoolean(key, (Boolean) value);
      } else if (value instanceof Integer) {
        map.putInt(key, (Integer) value);
      } else if (value instanceof Double) {
        map.putDouble(key, (Double) value);
      } else if (value instanceof String) {
        map.putString(key, (String) value);
      } else {
        map.putString(key, value.toString());
      }
    }
    return map;
  }

  public WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
    WritableArray array = new WritableNativeArray();

    for (int i = 0; i < jsonArray.length(); i++) {
      Object value = jsonArray.get(i);
      if (value instanceof JSONObject) {
        array.pushMap(this.convertJsonToMap((JSONObject) value));
      } else if (value instanceof JSONArray) {
        array.pushArray(convertJsonToArray((JSONArray) value));
      } else if (value instanceof Boolean) {
        array.pushBoolean((Boolean) value);
      } else if (value instanceof Integer) {
        array.pushInt((Integer) value);
      } else if (value instanceof Double) {
        array.pushDouble((Double) value);
      } else if (value instanceof String) {
        array.pushString((String) value);
      } else {
        array.pushString(value.toString());
      }
    }
    return array;
  }

  public JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
    JSONObject object = new JSONObject();
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      switch (readableMap.getType(key)) {
        case Null:
          object.put(key, JSONObject.NULL);
          break;
        case Boolean:
          object.put(key, readableMap.getBoolean(key));
          break;
        case Number:
          object.put(key, readableMap.getDouble(key));
          break;
        case String:
          object.put(key, readableMap.getString(key));
          break;
        case Map:
          object.put(key, convertMapToJson(readableMap.getMap(key)));
          break;
        case Array:
          object.put(key, convertArrayToJson(readableMap.getArray(key)));
          break;
      }
    }
    return object;
  }

  public JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {

    JSONArray array = new JSONArray();

    for (int i = 0; i < readableArray.size(); i++) {
      switch (readableArray.getType(i)) {
        case Null:
          break;
        case Boolean:
          array.put(readableArray.getBoolean(i));
          break;
        case Number:
          array.put(readableArray.getDouble(i));
          break;
        case String:
          array.put(readableArray.getString(i));
          break;
        case Map:
          array.put(convertMapToJson(readableArray.getMap(i)));
          break;
        case Array:
          array.put(convertArrayToJson(readableArray.getArray(i)));
          break;
      }
    }
    return array;
  }

  public static String[] toArgumentsArray(final ReadableArray readableArray) {
    final List<String> arguments = new ArrayList<>();
    for (int i = 0; i < readableArray.size(); i++) {
      final ReadableType type = readableArray.getType(i);

      if (type == ReadableType.String) {
        arguments.add(readableArray.getString(i));
      } else if (type == ReadableType.Number) {
        arguments.add(String.valueOf(readableArray.getInt(i)));
      }
    }
    return arguments.toArray(new String[0]);
  }

  public static int levelToInt(final Level level) {
    return (level == null) ? Level.AV_LOG_TRACE.getValue() : level.getValue();
  }

}