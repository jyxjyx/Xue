import { stateMixin } from './modules/state';
import elementMixin from './modules/element';
import { initMixin } from './modules/init';
import { hooksMixin } from './modules/hooks';
import warn from './utils/warn';
import checkAndAssignDefault from './utils/check';
import { OPTIONS_NORM } from './utils/constant';

function Xue(options) {
  checkAndAssignDefault(options, OPTIONS_NORM);
  if(typeof options !== 'object') return warn(`options should be an object rather than a/an ${ typeof options }`);
  this.init(this, options);
}
stateMixin(Xue);
elementMixin(Xue);
initMixin(Xue);
hooksMixin(Xue);

export default Xue;