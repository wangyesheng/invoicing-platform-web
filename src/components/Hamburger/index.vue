<template>
  <div
    style="padding: 0 20px;"
    @click="toggleClick"
  >
    <svg-icon
      class="hamburger"
      :class="{'is-active':isActive}"
      icon-class="collapse"
    />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick');
    },
  },
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  font-weight: 600;
  transform: rotate(180deg);
  font-size: 20px;
}

.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
