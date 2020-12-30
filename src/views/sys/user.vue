<template>
  <div class="app-content">
    User
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