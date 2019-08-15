package com.walletapp;

import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

public class WalletModule extends ReactContextBaseJavaModule {

    public WalletModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WalletModule";
    }

    @ReactMethod
    public void init_library(String gateway_base_api_url, Callback successCallback) {
        rnbridgewallet.init_library(getReactApplicationContext().getDataDir().getPath(), gateway_base_api_url);
        successCallback.invoke();
    }

    @ReactMethod
    public void invoke_cpp_method(String method, String param, Promise promise) {
        new Thread(
            new Runnable() {
                public void run() {
                    String result = rnbridgewallet.invoke_cpp_method(method, param);
                    promise.resolve(result);
                }
            }
        ).start();
    }
}