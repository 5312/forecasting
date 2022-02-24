<template>
  <div
    :class="[
      'login-wrapper',
      ['', 'login-form-right', 'login-form-left'][direction],
    ]"
  >
    <div class="log-title">
      <img src="~@/assets/junhui.png" />
      <p>安全分析预测暨风险评估系统</p>
    </div>
    <div class="log-form">
      <el-form
        ref="form"
        size="large"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter.native="doSubmit"
      >
        <el-form-item prop="username">
          <p>用户名：</p>
          <el-input
            clearable
            v-model="form.username"
            prefix-icon="el-icon-user"
            :placeholder="$t('login.username')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <p>密码：</p>
          <el-input
            show-password
            v-model="form.password"
            prefix-icon="el-icon-lock"
            :placeholder="$t('login.password')"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="login-input-group">
            <el-input
              clearable
              v-model="form.captcha"
              prefix-icon="el-icon-_vercode"
              :placeholder="$t('login.captcha')"
            />
            <img
              alt=""
              v-if="captcha"
              :src="captcha"
              @click="changeCode"
              class="login-captcha"
            />
          </div>
          <div class="el-form-item">
            <el-checkbox v-model="form.remember">{{
              $t("login.remember")
            }}</el-checkbox>
          </div>
        </el-form-item>
        <div class="el-form-item button">
          <el-button
            size="large"
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="doSubmit"
          >
            {{ loading ? $t("login.loading") : $t("login.login") }}
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="log-right">
      <p>
        以习近平新时代中国特色社会主义思想为指导，坚持战斗力这个唯一标准，坚持底线思维和安全发展理念，
        坚持预防为主的方针，遵循关口前移、层级负责、分级管控、依靠群众、突出重点、科学监管的原则。
      </p>
    </div>
    <div class="login-copyright">copyright © 2021 all rights reserved.</div>
    <!-- 多语言切换 -->

    <!-- 实际项目去掉这段 -->
    <!--    <div style="position: absolute;left: 30px;top: 20px;" class="hidden-xs-only">-->
    <!--      <el-radio-group v-model="direction" size="mini">-->
    <!--        <el-radio-button label="2">居左</el-radio-button>-->
    <!--        <el-radio-button label="0">居中</el-radio-button>-->
    <!--        <el-radio-button label="1">居右</el-radio-button>-->
    <!--      </el-radio-group>-->
    <!--    </div>-->
  </div>
</template>

<script>
import setting from "@/config/setting";

export default {
  name: "Login",
  data() {
    return {
      // 登录框方向, 0居中, 1居右, 2居左
      direction: 0,
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        username: "admin",
        password: "123456",
        idKey: "",
        remember: true,
      },
      // 验证码base64数据
      captcha: "",
      // 验证码内容, 实际项目去掉
      text: "",
    };
  },
  computed: {
    // 表单验证规则
    rules() {
      return {
        username: [
          {
            required: true,
            message: this.$t("login.username"),
            type: "string",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.password"),
            type: "string",
            trigger: "blur",
          },
        ],
        captcha: [
          {
            required: true,
            message: this.$t("login.captcha"),
            type: "string",
            trigger: "blur",
          },
        ],
      };
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    },
  },
  mounted() {
    if (setting.takeToken()) {
      this.goHome();
    } else {
      this.changeCode();
    }
  },
  methods: {
    /* 提交 */
    doSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        // if (this.form.code.toLowerCase() !== this.text) {
        //   this.$message.error('验证码错误');
        //   return;
        // }
        this.loading = true;
        // let formData = new FormData();
        // for (let key in this.form) {
        //   formData.append(key, this.form[key]);
        // }
        this.$http.post("/login", this.form).then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success("登录成功");
            this.$store
              .dispatch("user/setToken", {
                token: "Bearer " + res.data.data.access_token,
                remember: this.form.remember,
              })
              .then(() => {
                this.goHome();
              });
          } else {
            this.$message.error(res.data.msg);
            // 重新刷新验证码
            this.changeCode();
          }
        });
      });
    },
    /* 跳转到首页 */
    goHome() {
      const query = this.$route.query;
      const path = query && query.from ? query.from : "/";
      this.$router.push(path).catch(() => {});
    },
    /* 更换图形验证码 */
    changeCode() {
      // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
      this.$http
        .get("/captcha")
        .then((res) => {
          if (res.data.code === 0) {
            this.captcha = res.data.data;
            this.form.idKey = res.data.idkey;
            // // 实际项目后端一般会返回验证码的key而不是直接返回验证码的内容, 登录用key去验证, 可以根据自己后端接口修改
            // this.text = res.data.text;
            // // 自动回填验证码, 实际项目去掉这个
            // this.form.code = this.text;
            this.$refs.form.clearValidate();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((e) => {
          this.$message.error(e.message);
        });
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("i18n-lang", lang);
    },
  },
};
</script>

<style scoped>
/* 背景 */
.login-wrapper {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/index-bg.png");
  background-size: 100% 100%;
  min-height: 100vh;
}

/* 标题 */
.log-title {
  width: 28%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  position: relative;
  top: 200px;
  left: 10%;
}
.log-title img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.log-title p {
  font-size: 34px;
  color: rgba(256, 256, 256, 0.7);
  line-height: 60px;
  font-family: "微软雅黑";
}

/* 用户名密码 */
.log-form {
  width: 20%;
  padding: 25px 30px;
  position: relative;
  left: 15%;
  top: 450px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgba(256, 256, 256, 0);
}

/* 卡片 */
.login-form {
  width: 100%;
}
.login-form p {
  color: #fff;
  font-size: 20px;
  font-family: "微软雅黑";
}
.button {
  width: 40%;
}
.button .login-btn {
  font-size: 22px;
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}
.el-input__inner {
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
}
.login-form h4 {
  text-align: center;
  margin: 0 0 25px 0;
}

.login-form > .el-form-item {
  margin-bottom: 25px;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
}

.login-input-group ::v-deep .el-input {
  flex: 1;
}

.login-captcha {
  height: 38px;
  width: 102px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  text-align: center;
  cursor: pointer;
}

.login-captcha:hover {
  opacity: 0.75;
}

.login-btn {
  display: block;
  width: 100%;
}

/* 右侧文字 */
.log-right {
  float: right;
  margin-top: 250px;
  margin-right: 300px;
  padding: 20px 30px;
  width: 23%;
  min-width: 300px;
  border: 1px solid #c5d6f8;
  border-radius: 10px;
  background-image: linear-gradient(to top, #021865 0%, #02227e 100%);
  background-filter: alpha(Opacity=80);
  -moz-opacity: 0.8;
  opacity: 0.8;
}
.log-right p {
  text-indent: 2em;
  font-family: "楷体";
  color: #ffffff;
  line-height: 35px;
  font-size: 20px;
  background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  -webkit-background-clip: text;
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #fff;
  padding: 5px;
  margin: 0 10px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  padding-top: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 550px) {
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -220px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -220px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    margin-right: auto;
  }
}
</style>
