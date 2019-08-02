import VNode from '../classes/vnode';
import JSXObj from '../classes/jsxObj';
import Element from "../classes/element";
import { addNativeTags } from '../utils/constant';
import nextTick from '../utils/nextTick';
import warn from '../utils/warn';

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
  // 扩展nextTick方法
  Xue.prototype.nextTick = nextTick;

};

// 解析JSX，返回VNodeTree
export const parseJsxObj = function(xm, jsxObj, parentVNode) {
  const vnodeTree = new VNode(jsxObj, xm);
  jsxObj && jsxObj.children && jsxObj.children.forEach(item => vnodeTree.addChild(parseJsxObj(xm, item, vnodeTree)));
  vnodeTree.addParent(parentVNode);
  return vnodeTree;
}
// 首次渲染时生成DOM树
export const createDOMTree = function(xm, vnodeTree) {
  const elementTree = new Element(vnodeTree, xm);
  vnodeTree.addElement(elementTree);
  vnodeTree.children.forEach(item => {
    const childElementTree = createDOMTree(xm, item);
    // 原生类型需要插入到父节点，组件类型的节点，在mount阶段就插入至父节点中
    if(childElementTree.tagType === 'native') elementTree.appendChild(childElementTree)
  });
  return elementTree;
}
// 更新DOM树
export const update = function(xm, newVNode, oldVNode) {
  // 差异比对
  diff(xm, newVNode, oldVNode);
  xm._callHook.call(xm, 'updated');
  return newVNode;
}
// 比较两个vnodeTree的差异
export const diff = function(xm, newVNode, oldVNode, parentVNode, nextBroNode) {
  // 定义变化的类型
  let diffType = '';
  // 旧节点不存在
  // 或者旧节点为null，新节点不为null
  if(!oldVNode || (oldVNode.tag === null && newVNode.tag !== null)) {
    // 有节点新增
    diffType = 'addNode';
  }
  // 新节点不存在
  // 或者新节点为null，旧节点不为null
  else if(!newVNode || (oldVNode.tag !== null && newVNode.tag === null)) {
    // 有节点删除
    diffType = 'delNode';
  }
  // 节点标签不一样，直接替换
  else if(oldVNode.tag !== newVNode.tag) {
    // 替换节点
    diffType = 'replaceNode';
  }
  // 文本节点时，直接用新的文本节点替换旧的文本节点
  else if(newVNode.tag === '') {
    diffType = 'replaceText';
  }
  else {
    // 比较属性和事件
    diffType = 'updateAttrsAndEvents';
  }
  diffUpdateHandler(diffType, xm, newVNode, oldVNode, parentVNode, nextBroNode);
  // 递归处理子节点
  for(let i = 0; i < newVNode.children.length; i++) {
    // 下一个兄弟节点，为了在新增节点时，插入至正确的位置
    const nextBroNode = (i === newVNode.children.length - 1) ? null : oldVNode.children[i + 1];
    let oldVNodeParam = oldVNode && oldVNode.children[i];
    // 新增的节点的子节点和被替换后的节点的子节点，其在oldVNode中都是没有对应的值的
    if(diffType === 'addNode' || diffType === 'replaceNode') oldVNodeParam = undefined;
    diff(xm, newVNode.children[i], oldVNodeParam, newVNode, nextBroNode);
  }
}
// 对不同diff进行处理
export const diffUpdateHandler = function(diffType, xm, newVNode, oldVNode, parentVNode, nextBroNode) {
  switch(diffType) {
    case 'addNode': diffAddNode(xm, newVNode, oldVNode, parentVNode, nextBroNode); break;
    case 'delNode': diffDelNode(xm, newVNode, oldVNode, parentVNode); break;
    case 'replaceNode': diffReplaceNode(xm, newVNode, oldVNode, parentVNode); break;
    case 'replaceText': diffUpdateText(xm, newVNode, oldVNode, parentVNode); break;
    case 'updateAttrsAndEvents':
      if(newVNode.tagType === 'native') {
        diffAttribute(xm, newVNode, oldVNode);
        diffEvent(xm, newVNode, oldVNode); 
      } 
      else {
        diffComponentsAttr(xm, newVNode, oldVNode);
      }
      break;
    default: warn(`error diffType: ${ diffType }`);
  }
}
// 添加新节点
export const diffAddNode = function(xm, newVNode, oldVNode, parentVNode, nextBroNode) {
  const newElement = new Element(newVNode, xm);
  parentVNode.element.insertBefore(newElement, nextBroNode && nextBroNode.element);
  newVNode.addElement(newElement);
}
// 删除旧节点
export const diffDelNode = function(xm, newVNode, oldVNode, parentVNode) {
  parentVNode.element.removeChild(oldVNode.element);
  newVNode.addElement(new Element(new VNode(null), xm));
}
// 替换旧节点
export const diffReplaceNode = function(xm, newVNode, oldVNode, parentVNode) {
  const newElement = new Element(newVNode, xm);
  parentVNode.element.replaceChild(newElement, oldVNode.element);
  newVNode.addElement(newElement);
}
// 比较文本节点
export const diffUpdateText = function(xm, newVNode, oldVNode, parentVNode) {
  if(newVNode.text !== oldVNode.text) {
    oldVNode.element.updateTextContent(newVNode.text);
  }
  newVNode.addElement(oldVNode.element);
}
// 比较属性
export const diffAttribute = function(xm, newVNode, oldVNode) {
  // 拿到需要比较的所有属性
  const attrs = new Set(Object.keys(newVNode.attrs).concat(Object.keys(oldVNode.attrs)));
  // 更新属性
  attrs.forEach(attr => newVNode.attrs[attr] !== oldVNode.attrs[attr] && oldVNode.element.setAttribute(attr, newVNode.attrs[attr]));
  newVNode.addElement(oldVNode.element);
}
// 比较事件
export const diffEvent = function(xm, newVNode, oldVNode) {
  // 拿到需要比较的所有事件
  const events = new Set(Object.keys(newVNode.events).concat(Object.keys(oldVNode.events)));
  events.forEach(event => {
    // 当newVNode和oldVNode事件不同时
    if(newVNode.events[event] !== oldVNode.events[event]) {
      // 移除旧事件的响应函数
      oldVNode.element.removeEventListener(event, oldVNode.events[event]);
      // 如果新事件的响应函数存在，则添加
      if(newVNode.events[event]) {
        const handler = newVNode.events[event] = newVNode.events[event].bind(xm);
        oldVNode.element.addEventListener(event, handler);
      }
    }
  });
  newVNode.addElement(oldVNode.element);
}
// 比较组件的属性
export const diffComponentProps = function(xm, newVNode, oldVNode) {
  const props = new Set(Object.keys(newVNode.attrs).concat(Object.keys(oldVNode.attrs)));
  props.forEach(prop => {
    if(newVNode.attrs[prop] !== oldVNode.attrs[prop]) {
      // TODO:
      oldVNode.xm.$props[prop] = newVNode.attrs[prop];
    }
  })
}