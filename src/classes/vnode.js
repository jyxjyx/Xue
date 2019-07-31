import JSXObj from './jsxObj';
import { NativeTags } from '../utils/constant';

class VNode {
  constructor(tagMsg) {
    this.children = [];
    this.attrs = {};
    this.events = {};
    // 如果是JSXObj对象，则进行解析
    if(tagMsg instanceof JSXObj) {
      this.tag = tagMsg.tag;
      // 判断是否是原生标签
      if(NativeTags.includes(this.tag)) this.isNativeTag = true;
      // 如果不是，则进行组件化处理
      else {
        // TODO:组件化逻辑暂时跳过
        this.isNativeTag = false;
        
      }
      // 对attrs进行处理，分离出属性和事件
      tagMsg.attrs && Object.entries(tagMsg.attrs).forEach(([key, value]) => {
        if(key.match(/on[A-Z][a-zA-Z]*/)) {
          const eventName = key.substring(2, 3).toLowerCase() + key.substring(3);
          this.events[eventName] = value;
        }
        else this.attrs[key] = value;
      })
    }
    else if(tagMsg === null) {
      this.tag = null;
    }
    // 如果不是，则默认当做文本节点处理，文本节点的tag属性为空字符串
    else {
      this.tag = '';
      this.text = tagMsg;
    }

  }
  // 添加子节点
  addChild(child) {
    this.children.push(child);
  }
  // 缓存真实DOM
  addElement(element) {
    this.element = element;
  }
}
export default VNode;