/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */

#import <Foundation/Foundation.h>
#import <mobileffmpeg/ExecuteDelegate.h>
#import <React/RCTEventEmitter.h>

/**
 * Execute delegate for async executions.
 */
@interface RNExecuteDelegate : NSObject<ExecuteDelegate>

- (instancetype)initWithEventEmitter:(RCTEventEmitter*)eventEmitter;

@end
