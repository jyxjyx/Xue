import VNode from '../utils/vnode';
import JSXObj from '../utils/jsxObj';
import Element from "../classes/element";

export const elementMixin = function(Xue) {
  Xue.prototype._parseJSX = (tag, attrs, ...children) => {
    return new JSXObj({
      tag,
      attrs,
      children
    });
  }
  
};

// 解析JSX，返回VNodeTree
export const parseJsxObj = function(jsxObj) {
  const vnodeTree = new VNode(jsxObj);
  jsxObj.children && jsxObj.children.forEach(item => vnodeTree.addChild(parseJsxObj(item)));
  return vnodeTree;
}

// 生成DOM树
export const update = function(vnodeTree) {
  const elementTree = new Element(vnodeTree);
  vnodeTree.children && vnodeTree.children.forEach(item => elementTree.appendChild(update(item)))
  return elementTree;
}