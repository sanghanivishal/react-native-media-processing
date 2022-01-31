
#import "RNExecuteDelegate.h"
#import "RNMediaProcessing.h"
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#import <mobileffmpeg/MobileFFmpeg.h>
#import <mobileffmpeg/MobileFFprobe.h>
#import <mobileffmpeg/ArchDetect.h>
#import <mobileffmpeg/MediaInformation.h>

static NSString *const KEY_STAT_EXECUTION_ID = @"executionId";
static NSString *const KEY_STAT_TIME = @"time";
static NSString *const KEY_STAT_SIZE = @"size";
static NSString *const KEY_STAT_BITRATE = @"bitrate";
static NSString *const KEY_STAT_SPEED = @"speed";
static NSString *const KEY_STAT_VIDEO_FRAME_NUMBER = @"videoFrameNumber";
static NSString *const KEY_STAT_VIDEO_QUALITY = @"videoQuality";
static NSString *const KEY_STAT_VIDEO_FPS = @"videoFps";

static NSString *const KEY_EXECUTION_ID = @"executionId";
static NSString *const KEY_EXECUTION_START_TIME = @"startTime";
static NSString *const KEY_EXECUTION_COMMAND = @"command";

static NSString *const KEY_LOG_EXECUTION_ID = @"executionId";
static NSString *const KEY_LOG_MESSAGE = @"message";
static NSString *const KEY_LOG_LEVEL = @"level";

static NSString *const EVENT_LOG = @"RNFFmpegLogCallback";
static NSString *const EVENT_STAT = @"RNFFmpegStatisticsCallback";
static NSString *const EVENT_EXECUTE = @"RNFFmpegExecuteCallback";

@implementation RNMediaProcessing

RCT_EXPORT_MODULE(RNMediaProcessing)

- (NSArray<NSString*> *)supportedEvents {
    NSMutableArray *array = [NSMutableArray array];

    [array addObject:EVENT_LOG];
    [array addObject:EVENT_STAT];
    [array addObject:EVENT_EXECUTE];

    return array;
}

RCT_EXPORT_METHOD(getMediaInformation:(NSString*)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  MediaInformation *mediaInformation = [MobileFFprobe getMediaInformation:path];
  NSMutableDictionary *dict =  [NSMutableDictionary dictionary];
  [dict setObject:mediaInformation.getBitrate forKey:@"bitrate"];
  [dict setObject:mediaInformation.getDuration forKey:@"duration"];
  [dict setObject:mediaInformation.getFilename forKey:@"filename"];
  [dict setObject:mediaInformation.getFormat forKey:@"format"];
  [dict setObject:mediaInformation.getSize forKey:@"size"];
  [dict setObject:mediaInformation.getAllProperties forKey:@"allProperties"];
  resolve(dict);
}

RCT_EXPORT_METHOD(generateFile:(NSString*)extension resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString *cacheDirectory = [paths objectAtIndex:0];
  NSUUID *uuid = [NSUUID UUID];
  NSString *strUUID = [uuid UUIDString];
  NSString *outputPath = [NSString stringWithFormat:@"%@/%@.%@", cacheDirectory, strUUID, extension];
  resolve(outputPath);
}

RCT_EXPORT_METHOD(executeFFmpegWithArguments:(NSArray*)command resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
//  NSLog(@"==========================");
//  NSString *cmd = [command componentsJoinedByString:@" "];
//  NSLog(@"%@", cmd);
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    int rc = [MobileFFmpeg executeWithArguments:command];
    resolve([NSNumber numberWithInt:rc]);
  });
//  [MobileFFmpeg executeWithArguments:command];
//  resolve(cmd);
}

RCT_EXPORT_METHOD(enableLogEvents) {
    [MobileFFmpegConfig setLogDelegate:self];
}

RCT_EXPORT_METHOD(disableLogEvents) {
    [MobileFFmpegConfig setLogDelegate:nil];
}

RCT_EXPORT_METHOD(enableStatisticsEvents) {
    [MobileFFmpegConfig setStatisticsDelegate:self];
}

RCT_EXPORT_METHOD(disableStatisticsEvents) {
    [MobileFFmpegConfig setStatisticsDelegate:nil];
}

- (void)logCallback:(long)executionId :(int)level :(NSString*)message {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
        dictionary[KEY_LOG_EXECUTION_ID] = [NSNumber numberWithLong:executionId];
        dictionary[KEY_LOG_LEVEL] = [NSNumber numberWithInt:level];
        dictionary[KEY_LOG_MESSAGE] = message;

        [self emitLogMessage: dictionary];
    });
}

- (void)statisticsCallback:(Statistics *)statistics {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self emitStatistics: statistics];
    });
}


- (void)emitLogMessage:(NSDictionary*)logMessage{
    [self sendEventWithName:EVENT_LOG body:logMessage];
}


- (void)emitStatistics:(Statistics*)statistics{
    NSDictionary *dictionary = [RNMediaProcessing toStatisticsDictionary:statistics];
    [self sendEventWithName:EVENT_STAT body:dictionary];
}


+ (NSDictionary *)toStatisticsDictionary:(Statistics*)statistics {
    NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];

    if (statistics != nil) {
        dictionary[KEY_STAT_EXECUTION_ID] = [NSNumber numberWithLong: [statistics getExecutionId]];

        dictionary[KEY_STAT_TIME] = [NSNumber numberWithInt: [statistics getTime]];
        dictionary[KEY_STAT_SIZE] = [NSNumber numberWithLong: [statistics getSize]];

        dictionary[KEY_STAT_BITRATE] = [NSNumber numberWithDouble: [statistics getBitrate]];
        dictionary[KEY_STAT_SPEED] = [NSNumber numberWithDouble: [statistics getSpeed]];

        dictionary[KEY_STAT_VIDEO_FRAME_NUMBER] = [NSNumber numberWithInt: [statistics getVideoFrameNumber]];
        dictionary[KEY_STAT_VIDEO_QUALITY] = [NSNumber numberWithFloat: [statistics getVideoQuality]];
        dictionary[KEY_STAT_VIDEO_FPS] = [NSNumber numberWithFloat: [statistics getVideoFps]];
    }

    return dictionary;
}

@end
