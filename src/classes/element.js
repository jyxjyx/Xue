import VNode from './vnode';
class Element {
  constructor(vnode) {
    // 如果为null的话，则不做任何处理
    if(vnode.tag === null) return;
    // 非文本节点
    if(vnode.tag !== '') {
      this.el = document.createElement(vnode.tag);
      // 绑定属性
      Object.entries(vnode.attrs).forEach(([key, value]) => {
        this.setAttribute(key, value);
      });
      // 绑定事件
      Object.entries(vnode.events).forEach(([key, value]) => {
        this.addEventListener(key, value);
      });
    }
    // 文本节点
    else this.el = document.createTextNode(vnode.text);

  }
  appendChild(element) {
    this.el && element.el && this.el.appendChild(element.el);
  }
  removeChild(element) {
    this.el && element.el && this.el.removeChild(element.el);
  }
  setAttribute(name, value) {
    if(name === 'className') {
      this.el.setAttribute('class', value);
    }
    else if(name === 'style') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        this.el.style[styleKey] = styleValue;
      })
    }
    else {
      this.el.setAttribute(name, value);
    }
  }
  addEventListener(name, handler) {
    this.el.addEventListener(name, handler);
  }
  removeEventListener(name, handler) {
    this.el.removeEventListener(name, handler);
  }
  updateText(text) {
    const newElement = new Element(new VNode(text));
    this.replaceChild(newElement, this);
    this.el = newElement.el;
  }
  replaceChild(newElement, oldElement) {
    this.el.parentNode.replaceChild(newElement.el, oldElement.el);
  }
  insertBefore(newElement, referenceElement) {
    this.el.insertBefore(newElement.el, referenceElement && referenceElement.el);
  }
}
export default Element;