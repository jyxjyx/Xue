import warn from './warn';
const DEFAULT_OBJ = {};
const DEFAULT_FN = function() {};
const DEFAULT_ARR = [];

// 验证options的类型的对象
export const OPTIONS_NORM = {
  data: {
    type: 'function',
    default: () => {
      return {}
    }
  },
  watch: {
    type: 'object',
    default: DEFAULT_OBJ,
    children: {
      type: 'function',
      default: DEFAULT_FN
    }
  },
  computed: {
    type: 'object',
    default: DEFAULT_OBJ,
    children: {
      type: 'function',
      default: DEFAULT_FN
    }
  },
  props: {
    type: 'object',
    default: DEFAULT_ARR
  },
  methods: {
    type: 'object',
    default: DEFAULT_OBJ,
    children: {
      type: 'function',
      default: DEFAULT_FN
    }
  },
  render: {
    type: 'function',
    default: DEFAULT_FN
  },
  beforeCreate: {
    type: 'function',
    default: DEFAULT_FN
  },
  created: {
    type: 'function',
    default: DEFAULT_FN
  },
  beforeMount: {
    type: 'function',
    default: DEFAULT_FN
  },
  mounted: {
    type: 'function',
    default: DEFAULT_FN
  },
  beforeUpdate: {
    type: 'function',
    default: DEFAULT_FN
  },
  updated: {
    type: 'function',
    default: DEFAULT_FN
  },
  beforeDestory: {
    type: 'function',
    default: DEFAULT_FN
  },
  destoryed: {
    type: 'function',
    default: DEFAULT_FN
  },
};

// 生命周期常量
export const HOOK_NAMES = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed'
];

// 原生DOM标签
export const NativeTags = [
  'div',
  'p',
  'a',
  'span',
  'br'
];

// 扩展NativeTags方法
export const addNativeTags = function(tag) {
  if(typeof tag !== 'string') warn('the first parameter of addNativeTags should be a string');
  NativeTags.push(tag);
};