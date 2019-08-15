#import "RCTWallet.h"

#include "rnbridgewallet.hpp"

@implementation WalletModule

// To export a module named Wallet
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init_library:(NSString*) url  callback:(RCTResponseSenderBlock)callback)
{
  std::string gateway_base_url = std::string([url UTF8String]);
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  std::string basedir = std::string([documentsDirectory UTF8String]);
  
  RNCPP::init_library(basedir, gateway_base_url);
  
  callback(@[]);
}

RCT_EXPORT_METHOD(invoke_cpp_method:(NSString*) method  json_param:(NSString*)json_param
    resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  std::string method_str = std::string([method UTF8String]);
  std::string json_param_str = std::string([json_param UTF8String]);

  std::string return_json = RNCPP::invoke_cpp_method(method_str, json_param_str);
  
  NSString* result = [[NSString alloc] initWithUTF8String:return_json.c_str()];
  
  resolve(result);
}

@end
