<template>
  <div :class="['sidebar-user-wrap',collapse?'collapse':''] ">
    <div
      class="inner"
      v-if="!collapse"
    >
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3806311023,739217486&fm=26&gp=0.jpg"
        class="user-avatar"
      />
      <span class="username">{{appUser.userName}}</span>
    </div>
    <div
      class="inner"
      v-else
    >
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3806311023,739217486&fm=26&gp=0.jpg"
        class="user-avatar"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['userinfo']),
    appUser() {
      return JSON.parse(localStorage.getItem('platform_userinfo'));
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-user-wrap {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .inner {
    display: flex;
    flex-direction: column;
    padding: 18px 10px 10px;
    .user-avatar {
      cursor: pointer;
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      font-size: 12px;
    }
    .username {
      font-weight: 600;
      margin-top: 10px;
    }
  }
}
</style>