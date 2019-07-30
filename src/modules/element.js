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
  jsxObj && jsxObj.children && jsxObj.children.forEach(item => vnodeTree.addChild(parseJsxObj(item)));
  return vnodeTree;
}

// 生成DOM树
export const update = function(newVNode, oldVNode) {

  // 首次渲染
  if(!oldVNode) {
    const elementTree = new Element(newVNode);
    newVNode.children.forEach(item => elementTree.appendChild(update(item)));
    newVNode.addElement(elementTree);
    return elementTree;
  }
  // 组件更新
  else {
    diff(newVNode, oldVNode);
    return newVNode;
  }
}
// 比较两个vnodeTree的差异
export const diff = function(newVNode, oldVNode, parentVNode, nextBroNode) {
  // debugger
  if(!oldVNode || (oldVNode.tag === null && newVNode.tag !== null)) {
    // 有节点新增
    const newElement = new Element(newVNode)
    parentVNode.element.insertBefore(newElement, nextBroNode && nextBroNode.element);
    newVNode.addElement(newElement);
  }
  else if(!newVNode || (oldVNode.tag !== null && newVNode.tag === null)) {
    // 有节点删除
    parentVNode.element.removeChild(oldVNode);
    newVNode.addElement(oldVNode.element);
  }
  else if(oldVNode.tag !== newVNode.tag) {
    // 删除旧的，增加新的
    parentVNode.element.replaceChild(new Element(newVNode), oldVNode.element);
    newVNode.addElement(oldVNode.element);
  }
  // 文本节点时，直接将旧的文本节点删除，插入新的文本节点
  else if(newVNode.tag === '') {
    diffTextNode(newVNode, oldVNode);
    newVNode.addElement(oldVNode.element);
  }
  else {
    diffAttribute(newVNode, oldVNode);
    diffEvent(newVNode, oldVNode);
    newVNode.addElement(oldVNode.element);
  }
  
  // 需要改动
  for(let i = 0; i < newVNode.children.length; i++) {
    if(i === 3) debugger;
    const nextBroNode = (i === newVNode.children.length - 1) ? null : oldVNode.children[i + 1];
    diff(newVNode.children[i], oldVNode.children[i], newVNode, nextBroNode);
  }

}
// 比较属性
export const diffAttribute = function(newVNode, oldVNode) {
  // 拿到需要比较的所有属性
  const attrs = new Set(Object.keys(newVNode.attrs).concat(Object.keys(oldVNode.attrs)));
  // 更新属性
  attrs.forEach(attr => newVNode.attrs[attr] !== oldVNode.attrs[attr] && oldVNode.element.setAttribute(attr, newVNode.attrs[attr]));
}
// 比较事件
export const diffEvent = function(newVNode, oldVNode) {
  // 拿到需要比较的所有事件
  const events = new Set(Object.keys(newVNode.events).concat(Object.keys(oldVNode.events)));
  events.forEach(event => {
    // 当newVNode和oldVNode事件不同时
    if(newVNode.events[event] !== oldVNode.events[event]) {
      // 移除旧事件的响应函数
      oldVNode.element.removeEventListener(event, oldVNode.events[event]);
      // 如果新事件的响应函数存在，则添加
      newVNode.events[event] && oldVNode.element.addEventListener(event, newVNode.events[event]);
    }
  });
}
// 比较文本节点
export const diffTextNode = function(newVNode, oldVNode) {
  if(newVNode.text !== oldVNode.text) {
    oldVNode.element.updateText(newVNode.text);
  }
}