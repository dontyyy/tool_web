<template>
  <div class="pageframe flex">
    <div class="demoframe">
      <div class="demoBox" v-for="item in demoArr" @click="toModule(item)">
        <el-image
          class="demoImg"
          :src="item.logo"
          fit="fill"
          :preview-src-list="[]"
        />
        <div class="demoName">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import threeJS from "@/assets/threeJS.png";
import echarts from "@/assets/echarts.png";

const router = useRouter();

const demoArr = [
  {
    title: "three.js",
    detail: "3D",
    logo: threeJS,
    router: "/three",
    routerName: "three",
  },
  {
    title: "Echart",
    detail: "图标",
    logo: echarts,
    router: "/echart",
    routerName: "echart",
  },
];

function toModule(item: any) {
  const { href } = router.resolve({
    path: item.routerName,
  });
  window.open(href, "_blank");
}
</script>

<style scoped lang="scss">
.pageframe {
  width: 1440px;
  margin: 0 auto;
  min-height: 100vh;
}

.demoframe {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .demoBox {
    width: 160px;
    height: 160px;
    margin: 20px;
    padding: 20px;
    border-radius: 6px;
    opacity: 1;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);

    &:hover {
      margin-bottom: 30px;
      box-shadow: 0px 4px 10px 0px rgba(0, 115, 255, 0.3);
      transition: margin 0.2s;
    }

    .demoImg {
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 100px;
    }

    .demoName {
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
    }
  }
}

@media screen and (max-width: 1440px) {
  .pageframe {
    width: 100%;
    margin: 0 auto;
    min-height: 90vh;
  }

  .demoframe {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .demoBox {
      width: 100px;
      height: 100px;
      margin: 20px;
      padding: 15px;
      border-radius: 6px;
      opacity: 1;
      background: #ffffff;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);

      &:hover {
        margin-bottom: 20px;
        box-shadow: 0px 4px 10px 0px rgba(0, 115, 255, 0.3);
        transition: none;
      }

      .demoImg {
        display: block;
        margin: 0 auto;
        width: 60px;
        height: 60px;
      }

      .demoName {
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
      }
    }
  }
}

@media screen and (max-width: 680px) {
  .pageframe {
    width: 100%;
    margin: 0 auto;
    min-height: 90vh;
  }

  .demoframe {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .demoBox {
      width: 100px;
      height: 100px;
      margin: 20px;
      padding: 15px;
      border-radius: 6px;
      opacity: 1;
      background: #ffffff;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);

      &:hover {
        margin-bottom: 20px;
        box-shadow: 0px 4px 10px 0px rgba(0, 115, 255, 0.3);
        transition: none;
      }

      .demoImg {
        display: block;
        margin: 0 auto;
        width: 60px;
        height: 60px;
      }

      .demoName {
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
      }
    }
  }
}
</style>