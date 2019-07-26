const DEFAULT_OBJ = {};
const DEFAULT_FN = function() {};
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
    default: DEFAULT_OBJ
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