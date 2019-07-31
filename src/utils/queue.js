import nextTick from './nextTick';

let queue = [];
let waiting = false;
export const addUpdateQueue = function(watchers) {
  const queueSet = new Set([...queue, ...watchers]);
  queue = [...queueSet];
  queue.sort((a, b) => a.id - b.id);
  if(!waiting) {
    waiting = true;
    nextTick().then(() => {
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
