import warn from './warn';

function checkAndAssignDefault(checkValue, norms) {
  if(!(typeof checkValue === 'object' && typeof norms === 'object')) return warn('both of params should be object');
  Object.entries(norms).forEach(([key, norm]) => {
    const normType = norm.type;
    const normChild = norm.children;
    if(checkValue[key] === undefined) {
      checkValue[key] = norm.default;
    }
    else if(typeof checkValue[key] !== normType) {
      warn(`${ key } should be a/an ${ normType }`);
      checkValue[key] = norm.default;
    }
    else if(typeof checkValue[key] === normType && normChild) {
      Object.entries(checkValue[key]).forEach(([deepCheckKey, deepCheckValue]) => {
        if(typeof deepCheckValue !== normChild.type) {
          warn(`${ key }'s prop ${ deepCheckKey } should be a/an ${ normChild.type }`);
          checkValue[key][deepCheckKey] = normChild.default;
        }
      })
    }
  });
}

export default checkAndAssignDefault;