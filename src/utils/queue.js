import nextTick from './nextTick';

let queue = [];
let waiting = false;
export const addUpdateQueue = function(watchers) {
  const queueSet = new Set([...queue, ...watchers]);
  queue = [...queueSet];
  // 排序是为了保证父组件的watcher先与子组件生成
  queue.sort((a, b) => a.id - b.id);
  if(!waiting) {
    waiting = true;
    nextTick().then(() => {
      // 当前queue若为空数组则直接退出
      if(queue.length === 0) return waiting = false;
      for(let i = 0; i < queue.length; i++) {
        queue[i].run();
        if(i === queue.length - 1) waiting = false;
      }
    });
  }
}
export const clearQueue = function() {
  queue = [];
}
