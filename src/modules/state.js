import proxy from '../utils/proxy';
import warn from '../utils/warn';
import Dep from '../classes/dep';


export const stateMixin = function(Xue) {

};

// 初始化数据代理
export const initState = function() {
  this.$data = this.$options.data() || {};
  this.$props = this.$options.props;
  this.$methods = this.$options.methods;

  const dataNames = Object.keys(this.$data);
  const propNames = Object.keys(this.$props);
  const methodNames = Object.keys(this.$methods);

  // 检测是否有重名的data，methods或者props
  const checkedSet = new Set([...dataNames, ...propNames, ...methodNames]);
  if(checkedSet.size < dataNames.length + propNames.length + methodNames.length) return warn('you have same name in data, method, props');

  // 分别为data，props，methods中的属性代理到this上
  dataNames.forEach(name => proxy(this, '$data', name));
  propNames.forEach(name => proxy(this, '$props', name));
  methodNames.forEach(name => proxy(this, '$methods', name));

  // 将data设置为响应式
  observe(this.$data);


}

function observe(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    defineReactive(obj, key);
    if(typeof value === 'object') observe(value);
  })
}

function defineReactive(target, key) {
  let value = target[key];
  let dep = new Dep();
  Object.defineProperty(target, key, {
    get() {
      dep.depend();
      Dep.target.addDep(dep);
      return value;
    },
    set(newV) {
      value = newV;
      dep.notify();
    }
  })
}