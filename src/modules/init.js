import { initHooks } from './hooks';
import { initState } from './state';
import Watcher from '../utils/watcher';
import Dep from '../utils/dep';
import { parseJsxObj, update } from '../modules/element';

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
    const vnodeTree = parseJsxObj(xm.$render());
    const dom = update(vnodeTree);
    
    console.log({dom})


    xm._callHook.call(xm, 'beforeMount');

    // 挂载DOM
    // ...

    xm._callHook.call(xm, 'mounted');


  }
};