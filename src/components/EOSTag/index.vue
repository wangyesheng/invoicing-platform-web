<template>
  <span
    class="eos-tag"
    :class="[fullType,fullSize]"
  >
    <slot />
  </span>
</template>

<script>
export default {
  name: 'eos-tag',
  props: {
    type: {
      type: String,
      default: 'blue',
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  computed: {
    fullType() {
      return `eos-tag-${this.type}`;
    },
    fullSize() {
      return `eos-tag-size-${this.size}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.eos-tag {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  display: inline-block;
  height: auto;
  margin-right: 8px;
  padding: 0 10px;
  font-size: 12px;
  white-space: nowrap;
  background: #f8f8f8;
  border-radius: 4px;
  cursor: default;
  opacity: 1;
}

.eos-tag-size-small {
  line-height: 24px;
}

.eos-tag-size-medium {
  line-height: 28px;
}

.eos-tag-size-big {
  line-height: 32px;
}

.eos-tag-magenta {
  color: #eb2f96;
  background: #fff0f6;
}

.eos-tag-blue {
  color: #1890ff;
  background: #e6f7ff;
}

.eos-tag-purple {
  color: #722ed1;
  background: #f9f0ff;
}

.eos-tag-geekblue {
  color: #2f54eb;
  background: #f0f5ff;
}

.eos-tag-cyan {
  color: #13c2c2;
  background: #e6fffb;
}

.eos-tag-green {
  color: #52c41a;
  background: #f6ffed;
}

.eos-tag-lime {
  color: #a0d911;
  background: #fcffe6;
}

.eos-tag-gold {
  color: #faad14;
  background: #fffbe6;
}

.eos-tag-orange {
  color: #fa8c16;
  background: #fff7e6;
}

.eos-tag-volcano {
  color: #ff502c;
  background: #fff2e8;
}

.eos-tag-red {
  color: #f5222d;
  background: #fff1f0;
}

.eos-tag-gray {
  color: #909399;
  background: #f4f4f5;
}
</style>