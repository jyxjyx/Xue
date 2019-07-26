let queue = [];
export const addUpdateQueue = function(watchers) {
  const queueSet = new Set([...queue, ...watchers]);
  queue = [...queueSet];
  queue.sort();
  queue.forEach(watcher => watcher.run());
}