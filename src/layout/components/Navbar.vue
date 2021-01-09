<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="right-menu">
      <el-popconfirm
        title="确定要退出吗？"
        cancel-button-text='再等等'
        confirm-button-text='确定'
        confirm-button-type="text"
        @confirm="logout"
      >
        <i
          slot="reference"
          class="el-icon-switch-button"
        />
      </el-popconfirm>

      <!-- <el-dropdown
        class="avatar-container"
        trigger="hover"
        placement="bottom"
      >
        <div class="avatar-wrapper">
          <img
            src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3806311023,739217486&fm=26&gp=0.jpg"
            class="user-avatar"
          />
          <span class="username">{{appUser.userName}}</span>
        </div>
        <div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
            <el-dropdown-item
              divided
              @click.native="logout"
            >
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(['sidebar', 'userinfo']),
    appUser() {
      return JSON.parse(localStorage.getItem('platform_userinfo'));
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.01), 0 10px 30px rgba(0, 0, 0, 0.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    float: right;
    padding: 14px 30px;
    color: #1890ff;

    & /deep/ .el-icon-switch-button {
      font-size: 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        margin-top: 8px;
        .username {
          position: relative;
          bottom: 10px;
          left: 5px;
        }

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
