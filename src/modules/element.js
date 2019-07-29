import VNode from '../classes/vnode';
import JSXObj from '../classes/jsxObj';
import Element from "../classes/element";
import { addNativeTags } from '../utils/constant'

export const elementMixin = function(Xue) {
  Xue.prototype._parseJSX = (tag, attrs, ...children) => {
    return new JSXObj({
      tag,
      attrs,
      children
    });
  }
  Xue.prototype._mount = function(dom) {
    const root = this.$options.root;
    if(typeof root === 'string') this.$el = document.querySelector(root);
    else if(root instanceof HTMLElement) this.$el = root;
    this.$el.appendChild(dom);
  }
  // 扩展原生标签方法
  Xue.addNativeTags = addNativeTags;
};

// 解析JSX，返回VNodeTree
export const parseJsxObj = function(jsxObj) {
  const vnodeTree = new VNode(jsxObj);
  jsxObj.children && jsxObj.children.forEach(item => vnodeTree.addChild(parseJsxObj(item)));
  return vnodeTree;
}

// 生成DOM树
export const update = function(newVNode, oldVNode) {
  // 首次渲染
  if(!oldVNode) {
    const elementTree = new Element(newVNode);
    newVNode.children && newVNode.children.forEach(item => elementTree.appendChild(update(item)));
    newVNode.addElement(elementTree);
    return elementTree;
  }
  // 组件更新
  else {
    diff(newVNode, oldVNode);
  }
}

export const diff = function(newVNode, oldVNode) {

}