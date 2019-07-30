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
  // 旧节点不存在
  // 或者旧节点为null，新节点不为null
  if(!oldVNode || (oldVNode.tag === null && newVNode.tag !== null)) {
    // 有节点新增
    diffAddNode(newVNode, oldVNode, parentVNode, nextBroNode);
  }
  // 新节点不存在
  // 或者新节点为null，旧节点不为null
  else if(!newVNode || (oldVNode.tag !== null && newVNode.tag === null)) {
    // 有节点删除
    diffDelNode(newVNode, oldVNode, parentVNode);
  }
  // 节点标签不一样，直接替换
  else if(oldVNode.tag !== newVNode.tag) {
    // 替换节点
    diffReplaceNode(newVNode, oldVNode, parentVNode);
  }
  // 文本节点时，直接将旧的文本节点删除，插入新的文本节点
  else if(newVNode.tag === '') {
    diffTextNode(newVNode, oldVNode);
  }
  // 比较属性和事件
  else {
    diffAttribute(newVNode, oldVNode);
    diffEvent(newVNode, oldVNode);
  }
  // 递归处理子节点
  for(let i = 0; i < newVNode.children.length; i++) {
    // 下一个兄弟节点，为了在新增节点时，插入至正确的位置
    const nextBroNode = (i === newVNode.children.length - 1) ? null : oldVNode.children[i + 1];
    diff(newVNode.children[i], oldVNode.children[i], newVNode, nextBroNode);
  }
}
// 添加新节点
export const diffAddNode = function(newVNode, oldVNode, parentVNode, nextBroNode) {
  const newElement = new Element(newVNode)
  parentVNode.element.insertBefore(newElement, nextBroNode && nextBroNode.element);
  newVNode.addElement(newElement);
}
// 删除旧节点
export const diffDelNode = function(newVNode, oldVNode, parentVNode) {
  parentVNode.element.removeChild(oldVNode);
  newVNode.addElement(oldVNode.element);
}
// 替换旧节点
export const diffReplaceNode = function(newVNode, oldVNode, parentVNode) {
  parentVNode.element.replaceChild(new Element(newVNode), oldVNode.element);
  newVNode.addElement(oldVNode.element);
}
// 比较属性
export const diffAttribute = function(newVNode, oldVNode) {
  // 拿到需要比较的所有属性
  const attrs = new Set(Object.keys(newVNode.attrs).concat(Object.keys(oldVNode.attrs)));
  // 更新属性
  attrs.forEach(attr => newVNode.attrs[attr] !== oldVNode.attrs[attr] && oldVNode.element.setAttribute(attr, newVNode.attrs[attr]));
  newVNode.addElement(oldVNode.element);
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
  newVNode.addElement(oldVNode.element);
}
// 比较文本节点
export const diffTextNode = function(newVNode, oldVNode) {
  if(newVNode.text !== oldVNode.text) {
    oldVNode.element.updateText(newVNode.text);
  }
  newVNode.addElement(oldVNode.element);
}