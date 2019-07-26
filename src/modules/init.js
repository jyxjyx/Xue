import { initHooks } from './hooks';
import { initState, defineReactive } from './state';
import Watcher from '../utils/watcher';
import Dep from '../utils/dep';

export const initMixin = function(Xue) {
  Xue.prototype.init = (xm, options) => {
    xm.$options = options;
    xm.$render = xm.$options.render.bind(xm);

    // 初始化生命周期
    initHooks.call(xm);
    
    xm._callHook.call(xm, 'beforeCreate');

    // 初始化数据挂载
    initState.call(xm);

    xm._callHook.call(xm, 'created');

    // 响应式


    // 调用render生成VNode
    // ...
    Dep.target = xm.$watcher = new Watcher('render', xm.$render);
    xm.$render(); //返回解析对象


    xm._callHook.call(xm, 'beforeMount');

    // 挂载DOM
    // ...

    xm._callHook.call(xm, 'mounted');


  }
};