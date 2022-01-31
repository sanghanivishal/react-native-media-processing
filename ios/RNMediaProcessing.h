
#import <Foundation/Foundation.h>
#import <mobileffmpeg/MobileFFmpegConfig.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNMediaProcessing : RCTEventEmitter<RCTBridgeModule,LogDelegate,StatisticsDelegate>

@end
