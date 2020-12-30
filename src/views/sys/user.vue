<template>
  <div class="app-content">
    <div class="user-wrap">
      <el-button>hello</el-button>
    </div>
  </div>
</template>

<script>
import { getViewUserMainRes } from '@/api/user';
export default {
  data() {
    return {};
  },
  mounted() {
    this.getViewUserMain();
  },
  methods: {
    async getViewUserMain() {
      const res = await getViewUserMainRes();
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>