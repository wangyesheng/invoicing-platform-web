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
        <el-form label-suffix="：" label-position="left">
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
          <el-divider content-position="center">修改密码</el-divider>
          <el-form-item label="旧密码">
            <el-input
              placeholder="请输入旧密码"
              v-model="userProfileDialog.formData.oldPassword"
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              placeholder="请输入新密码"
              v-model="userProfileDialog.formData.newPassword"
            />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input
              placeholder="请输入新密码"
              v-model="userProfileDialog.formData.confirmNewPassword"
            />
          </el-form-item>
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
        formData: {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        },
      },
    };
  },

  methods: {
    onShowUserProfile() {
      console.log(this.$route);
      this.userProfileDialog.visible = true;
    },
    onSave() {
      this.$confirm(`确定修改密码吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { oldPassword, newPassword, confirmNewPassword } =
            this.userProfileDialog.formData;
          if (confirmNewPassword != newPassword) {
            this.$message.warning("两次输入的新密码不一致！");
          } else if (oldPassword == newPassword) {
            this.$message.warning("新旧密码相同！");
          } else {
            const data = await this.$put(
              `/api/core/v1/auth/${this.userinfo.account}`,
              {
                password: oldPassword,
                newPassword,
              }
            );
            if (data) {
              this.$notify({
                title: "成功",
                message: "密码修改成功，三秒后将重定向到登录页！",
                type: "success",
              });
              setTimeout(async () => {
                await this.$store.dispatch("user/logout");
                this.$router.push("/login");
              }, 3000);
            }
          }
        })
        .catch(() => {});
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
      color: #878787;
    }

    .el-form-item__content {
      span.value {
        font-size: 14px;
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