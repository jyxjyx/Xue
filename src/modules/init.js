import { initHooks } from './hooks';
import { initState } from './state';
import Watcher from '../classes/watcher';
import Dep from '../classes/dep';
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

    // 调用render生成VNode
    Dep.target = xm.$watcher = new Watcher('render', () => {
      xm._callHook.call(xm, 'beforeUpdate');
      const newVnodeTree = parseJsxObj(xm.$render());
      update(newVnodeTree, xm.$vnodeTree);
    }, () => {
      xm._callHook.call(xm, 'updated');
      // 重新缓存
      xm.$vnodeTree = parseJsxObj(xm.$render());
    });
    // 生成vnode
    xm.$vnodeTree = parseJsxObj(xm.$render());
    
    xm._callHook.call(xm, 'beforeMount');

    // 生成并挂载DOM
    xm._mount.call(xm, update(xm.$vnodeTree).el);

    xm._callHook.call(xm, 'mounted');

  }
};