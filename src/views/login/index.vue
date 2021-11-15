<template>
  <div class="login">
    <div class="login-card">
      <div class="login-card-left">
        <div class="content">
          <!-- <div class="logo">MOON_STUDIO</div> -->
          <div class="title">库存管理系统</div>
          <div class="form-wrap">
            <el-form
              size="medium"
              ref="loginForm"
              class="login-form"
              auto-complete="on"
              label-position="left"
              :model="loginForm"
              :rules="loginRules"
            >
              <el-form-item prop="username" label="Username">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="Username"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password" label="Password">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click.native.prevent="handleLogin"
                >
                  Sign in
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="login-card-center">
        <div class="login-card-center-circles">
          <div class="login-card-center-circles-row">
            <div class="login-card-center-circles-row-light"></div>
            <div class="login-card-center-circles-row-deep"></div>
          </div>
          <div class="login-card-center-circles-row">
            <div class="login-card-center-circles-row-light"></div>
            <div class="login-card-center-circles-row-deep"></div>
          </div>
        </div>
      </div>
      <div class="login-card-right">
        <div class="login-card-right-info">
          <div class="login-card-right-info-details"></div>
        </div>
        <div class="login-card-right-petal"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入账号！"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码！" },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const value = await this.$store.dispatch(
              "user/login",
              this.loginForm
            );
            if (value) {
              this.$router.push({ path: this.redirect || "/" });
            }
          } catch (error) {
            this.$notify.error({
              title: "出了点小问题~",
              message: error,
            });
          }
          this.loading = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #060238;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .form-wrap {
    width: 100%;
    ::v-deep {
      .el-form-item__label {
        font-size: 16px;
      }
      .el-input__inner {
        height: 46px;
        line-height: 46px;
      }

      .el-button {
        width: 100%;
        height: 46px;
        margin: 20px 0;
        border-radius: 50px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 42px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }
  }
  &-card {
    position: relative;
    display: flex;
    width: 1300px;
    height: 800px;
    min-height: 780px;
    border-radius: 25px;
    background-color: #fff;
    &-left {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 70%;
        height: 50%;
        .logo,
        .title,
        .username,
        .password {
          width: 100%;
          text-align: left;
        }
        .title {
          font-size: 38px;
          font-weight: bold;
          margin-bottom: 38px;
        }
        .username,
        .password {
          font-weight: bold;
          margin: 10px 0;
        }
        .n-input {
          border-radius: 5px;
        }
        .submit {
          width: 100%;
          margin: 20px 0;
          .n-button {
            width: 100%;
          }
        }
        .forgot {
          width: 100%;
        }
      }
    }
    &-center {
      position: relative;
      width: 400px;
      &-circles {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        height: 50%;
        &-row {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: flex-end;
          &-light {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background-color: #fadca0;
          }
          &-deep {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background-color: #f3b63f;
          }
        }
      }
    }
    &-right {
      position: relative;
      width: 400px;
      &-info {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 50%;
        border-top-right-radius: 25px;
        background-color: #97a6e0;
        &-details {
          display: flex;
          justify-content: center;
          color: #fff;
          width: 100%;
          height: 100%;
          border-top-right-radius: 25px;
          border-bottom-right-radius: 100%;
          background-color: #3e54d8;
        }
      }
      &-petal {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50%;
        border-radius: 50%;
        border-bottom-right-radius: 25px;
        background-color: #ed6271;
      }
    }
  }
}
</style>
