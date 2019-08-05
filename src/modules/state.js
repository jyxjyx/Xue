import proxy from '../utils/proxy';
import warn from '../utils/warn';
import Dep from '../classes/dep';


export const stateMixin = function(Xue) {

};

// 初始化数据代理
export const initState = function() {
  this.$data = this.$options.data() || {};
  // this.$props = this.$options.props;
  this.$methods = this.$options.methods;
  this.props = this.$options.$props || {};

  const dataNames = Object.keys(this.$data);
  // const propNames = Object.keys(this.$props);
  const methodNames = Object.keys(this.$methods);

  // 检测是否有重名的data，methods或者props
  // const checkedSet = new Set([...dataNames, ...propNames, ...methodNames]);
  // if(checkedSet.size < dataNames.length + propNames.length + methodNames.length) return warn('you have same name in data, method, props');
  const checkedSet = new Set([...dataNames, ...methodNames]);
  if(checkedSet.size < dataNames.length + methodNames.length) return warn('you have same name in data, method');

  // 分别为data，props，methods中的属性代理到this上
  dataNames.forEach(name => proxy(this, '$data', name));
  // propNames.forEach(name => proxy(this, '$props', name));
  methodNames.forEach(name => proxy(this, '$methods', name));

  // 将data设置为响应式
  observe(this.$data);
  // 将props设置为响应式
  observe(this.props);
  
}

function observe(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    defineReactive(obj, key);
    if(typeof value === 'object') observe(value);
  });
  
}

function defineReactive(target, key) {
  let value = target[key];
  let dep = new Dep(value);
  Object.defineProperty(target, key, {
    get() {
      dep.addWatcher();
      Dep.target.addDep(dep);
      return value;
    },
    set(newV) {
      dep.updateValue(newV);
      value = newV;
      dep.notify();
    }
  })
}