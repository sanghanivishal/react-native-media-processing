/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */

#import "RNExecuteDelegate.h"

static NSString *const EVENT_EXECUTE = @"RNFFmpegExecuteCallback";

/**
 * Execute delegate for async executions.
 */
@implementation RNExecuteDelegate {
    RCTEventEmitter* _eventEmitter;
}

- (instancetype)initWithEventEmitter:(RCTEventEmitter*)eventEmitter {
    self = [super init];
    if (self) {
        _eventEmitter = eventEmitter;
    }

    return self;
}

- (void)executeCallback:(long)executionId :(int)returnCode {
    NSMutableDictionary *executeDictionary = [[NSMutableDictionary alloc] init];
    executeDictionary[@"executionId"] = [NSNumber numberWithLong: executionId];
    executeDictionary[@"returnCode"] = [NSNumber numberWithInt: returnCode];

    [_eventEmitter sendEventWithName:EVENT_EXECUTE body:executeDictionary];
}

@end
