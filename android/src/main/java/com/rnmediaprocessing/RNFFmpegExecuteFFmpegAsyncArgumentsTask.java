
package com.rnmediaprocessing;

import android.os.AsyncTask;
import android.util.Log;

import com.arthenica.mobileffmpeg.Config;
import com.arthenica.mobileffmpeg.FFmpeg;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;

import static com.arthenica.mobileffmpeg.Config.RETURN_CODE_CANCEL;
import static com.arthenica.mobileffmpeg.Config.RETURN_CODE_SUCCESS;

class RNFFmpegExecuteFFmpegAsyncArgumentsTask extends AsyncTask<String, Integer, Integer> {

    private final Promise promise;
    private final String[] argumentsArray;

    RNFFmpegExecuteFFmpegAsyncArgumentsTask(final Promise promise, final ReadableArray... readableArrays) {
        this.promise = promise;

        /* PREPARING ARGUMENTS */
        if ((readableArrays != null) && (readableArrays.length > 0)) {
            this.argumentsArray = RNMediaProcessingModule.toArgumentsArray(readableArrays[0]);
        } else {
            this.argumentsArray = new String[0];
        }
    }

    @Override
    protected Integer doInBackground(final String... unusedArgs) {
        return FFmpeg.execute(argumentsArray);
    }

   @Override
       protected void onPostExecute(final Integer rc) {
           if (rc == RETURN_CODE_SUCCESS) {
               promise.resolve("File execution completed successfully.");
           } else if (rc == RETURN_CODE_CANCEL) {
               promise.reject("File execution cancelled by user.");
           } else {
               Config.printLastCommandOutput(Log.INFO);
               promise.reject(String.format("File execution failed with rc=%d and the output below.", rc));
           }
       }

}
