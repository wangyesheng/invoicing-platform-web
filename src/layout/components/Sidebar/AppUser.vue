<template>
  <div
    :class="['sidebar-user-wrap', collapse ? 'collapse' : '']"
    @click="onShowUserProfile"
  >
    <div class="inner" v-if="!collapse">
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3806311023,739217486&fm=26&gp=0.jpg"
        class="user-avatar"
      />
      <span class="username">{{ appUser.userName }}</span>
    </div>
    <div class="inner" v-else>
      <img
        src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3806311023,739217486&fm=26&gp=0.jpg"
        class="user-avatar"
      />
    </div>
    <el-dialog
      width="30%"
      title="个人信息"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="userProfileDialog.visible"
    >
      <div class="profile-wrap">
        <el-form label-suffix="：">
          <el-form-item label="账号">
            <span class="value">{{ userinfo.account }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span class="value">{{ userinfo.userName }}</span>
          </el-form-item>
          <el-form-item label="角色">
            <el-tag
              v-for="item in userinfo.roles"
              :key="item.roleId"
              effect="plain"
            >
              {{ item.roleName }}
            </el-tag>
          </el-form-item>
          <el-form-item label="权限">
            <el-tag
              v-for="item in userinfo.funs"
              :key="item.funRoute"
              effect="plain"
              type="success"
            >
              {{ item.funName }}
            </el-tag>
          </el-form-item>
          <el-divider content-position="left">修改密码</el-divider>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => (userProfileDialog.visible = false)">
          取 消
        </el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapGetters(["userinfo"]),
    appUser() {
      return JSON.parse(localStorage.getItem("platform_userinfo"));
    },
  },

  data() {
    return {
      userProfileDialog: {
        visible: false,
      },
    };
  },

  methods: {
    onShowUserProfile() {
      console.log(this.userinfo);
      this.userProfileDialog.visible = true;
    },
    onSave() {},
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
      border-radius: 5px;
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

.profile-wrap {
  ::v-deep {
    .el-tag {
      margin-right: 10px;
    }

    .el-form-item__label {
      font-size: 14px;
    }

    .el-form-item__content {
      span.value {
        font-size: 16px;
        font-weight: 600;
        color: #666;
      }
    }

    .el-divider__text {
      font-size: 16px;
    }
  }
}
</style>