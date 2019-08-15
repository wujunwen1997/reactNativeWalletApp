import * as React from 'react';
import indexModel from './models/index'
import { Provider } from 'react-redux';
import App from './routes'

import { create } from 'dva-core';

const models = [indexModel];

const app = create(); // 创建dva实例，可传递配置参数。https://dvajs.com/api/#app-dva-opts
models.forEach((o) => { // 装载models对象
  app.model(o);
});

app.start(); // 实例初始化
const store = app._store; // 获取redux的store对象供react-redux使用

export default class Container extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
