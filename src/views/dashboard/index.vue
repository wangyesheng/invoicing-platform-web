<template>
  <div class="app-content">
    <div class="dashboard-text">name: {{ userinfo.username }}</div>
    <div class="dashboard-text">
      roles:
      <span
        v-for="role in userinfo.roles"
        :key="role"
      >{{ role }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['userinfo']),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
