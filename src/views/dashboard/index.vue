<template>
  <div class="content-wrap">
    <div class="header">
      <div class="inner">
        <img :src="require('../../assets/user/avatar.png')" alt="" />
        <p>晚上好` {{ userinfo.userName }} `，愿你天黑有灯，下雨有伞。</p>
        <!-- <p>晚上好` {{ userinfo.userName }} `，愿你天黑有灯，下雨有伞。</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userinfo"]),
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  height: 100px;
  padding: 20px;
  line-height: 30px;
  .inner {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 20px;
    }
    p{

    }
  }
}
</style>