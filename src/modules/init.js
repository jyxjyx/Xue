import { initHooks } from './hooks';
import { initState } from './state';
import Watcher from '../classes/watcher';
import Dep from '../classes/dep';
import { parseJsxObj, update, createDOMTree } from '../modules/element';

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
    xm.$watcher = new Watcher(() => {
      xm._callHook.call(xm, 'beforeUpdate');
      const newVnodeTree = parseJsxObj(xm, xm.$render());
      xm.$vnodeTree = update(xm, newVnodeTree, xm.$vnodeTree);
    }, 'render');
    // 把当前Wacther入栈
    Dep.pushTarget(xm.$watcher);
    
    xm._callHook.call(xm, 'beforeMount');

    // 生成vnode
    xm.$vnodeTree = parseJsxObj(xm, xm.$render());
    console.log(xm.$vnodeTree)

    // 生成并挂载DOM
    xm._mount.call(xm, createDOMTree(xm, xm.$vnodeTree).el);

    xm._callHook.call(xm, 'mounted');

  }
};