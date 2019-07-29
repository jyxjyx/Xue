import JSXObj from './jsxObj';

class VNode {
  constructor(tagMsg) {
    // 如果是JSXObj对象，则进行解析
    if(tagMsg instanceof JSXObj) {
      this.tag = tagMsg.tag;
      this.children = [];
      this.attrs = {};
      this.events = {};
      // 对attrs进行处理，分离出属性和事件
      tagMsg.attrs && Object.entries(tagMsg.attrs).forEach(([key, value]) => {
        if(key.match(/on[A-Z][a-zA-Z]*/)) {
          const eventName = key.substring(2, 3).toLowerCase() + key.substring(3);
          this.events[eventName] = value;
        }
        else this.attrs[key] = value;
      })
    }
    // 如果不是，则默认当做文本节点处理，文本节点的tag属性为空字符串
    else {
      this.tag = '';
      this.text = tagMsg.toString();
    }

  }
  addChildren(children) {
    this.children = children;
  }
  addChild(child) {
    this.children.push(child);
  }
}
export default VNode;