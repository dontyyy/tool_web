<template>
  <div class="pageBg">
    <div class="loginframe">
      <div class="logoframe">
        <el-image
          class="logo"
          :src="loginlogo"
          fit="fill"
          :preview-src-list="[]"
        />
      </div>
      <div>
        <el-input
          style="margin-bottom: 42px"
          v-model="loginInfo.account"
          placeholder="请输入账号"
        />
        <el-input v-model="loginInfo.password" placeholder="请输入密码" />
      </div>
      <div class="loginIn flex" @click="handleLogin">登 录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import loginlogo from "@/assets/Login_logo.png";

const router = useRouter();

const loginInfo = ref({
  account: "admin",
  password: "admin",
});

function handleLogin() {
  if (loginInfo.value.account === "admin") {
    router.push({ path: "home" });
  } else {
    ElMessage.error("账户名或密码错误");
  }
}
</script>
<style scoped lang="scss">
.pageBg {
  background: url("../assets/Login_bg.png");
  height: calc(100vh - 1px);
  padding-top: 1px;
}

.loginframe {
  margin: calc(50vh - 250px) auto 0 auto;
  width: 40%;
  max-width: 500px;
  padding: 100px 100px 80px 100px;
  background: #ffffff;
  border-radius: 15px 15px 15px 15px;
  opacity: 1;

  .logoframe {
    width: 240px;
    height: 240px;
    margin: -240px auto 40px;
  }

  .logo {
    width: 240px;
    height: 240px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 0;
    box-shadow: none;
    border-bottom: 2px solid #959c9d;
  }

  .loginIn {
    width: 250px;
    height: 60px;
    background: #b3e0fd;
    border-radius: 10px;
    margin: 56px auto 0;
    font-size: 34px;
    font-weight: 400;
    color: #16d0f5;
  }
}

@media screen and (max-width: 680px) {
  .loginframe {
    margin: 200px auto 0 auto;
    width: calc(100% - 120px);
    padding: 40px;
    background: #ffffff;
    border-radius: 15px 15px 15px 15px;
    opacity: 1;

    .logoframe {
      width: 200px;
      height: 200px;
      margin: -160px auto 40px;
    }

    .logo {
      width: 200px;
      height: 200px;
    }

    :deep(.el-input__wrapper) {
      border-radius: 0;
      box-shadow: none;
      border-bottom: 2px solid #959c9d;
    }

    .loginIn {
      width: 200px;
      height: 50px;
      background: #b3e0fd;
      border-radius: 10px;
      margin: 40px auto 0;
      font-size: 24px;
      font-weight: 400;
      color: #16d0f5;
    }
  }
}
</style>