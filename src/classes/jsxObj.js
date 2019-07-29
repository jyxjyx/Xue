class JSXObj {
  constructor({ tag, attrs, children }) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
    // 用来判断是否是Xue的元素
    this.isXElement = true;
  }
}
export default JSXObj;