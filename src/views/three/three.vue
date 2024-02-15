<template>
  <div class="pageframe flex">
    <div class="demoframe">
      <div class="demoBoxframe" v-for="item in demoArr" @click="toModule(item)">
        <div class="demoBox flex">
          <div class="demoName">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- <el-dialog
    v-model="modelParams.visable"
    :title="modelParams.title"
    :width="modelParams.width || 800"
    @close="CloseModule"
    fullscreen
  >
    <div
      style="width: 100%; height: 500px; position: relative"
      v-if="modelParams.module === 1"
    >
      <firstThree></firstThree>
    </div>
  </el-dialog> -->
</template>

<script setup lang="ts">
const router = useRouter();
const demoArr = [
  {
    id: 1,
    title: "立体与材质",
    router: "/three1",
    routerName: "three1",
  },
  {
    id: 2,
    title: "平面 + 顶点创建平面",
    router: "/three2",
    routerName: "three2",
  },
  {
    id: 3,
    title: "贴图",
    router: "/three3",
    routerName: "three3",
  },
  {
    id: 4,
    title: "雾",
    router: "/three4",
    routerName: "three4",
  },
  {
    id: 5,
    title: "导入模型 + 包围盒 + 边缘线段几何体",
    router: "/three5",
    routerName: "three5",
  },
  {
    id: 6,
    title: "光线投射 + 交互事件 + 多物体包围盒",
    router: "/three6",
    routerName: "three6",
  },
  {
    id: 7,
    title: "补间动画",
    router: "/three7",
    routerName: "three7",
  },
  {
    id: 8,
    title: "灯光",
    router: "/three8",
    routerName: "three8",
  },
  {
    id: 9,
    title: "平面图片转3D",
    router: "/three9",
    routerName: "three9",
  },
  {
    id: 10,
    title: "cannon物理特性",
    router: "/three10",
    routerName: "three10",
  },
];

function toModule(item: any) {
  const { href } = router.resolve({
    path: item.routerName,
  });
  window.open(href, "_blank");
}
// let modelParams = ref({
//   visable: false,
//   title: "",
//   width: 800,
//   module: null,
// });

// function OpenModule(item: any) {
//   modelParams.value = {
//     visable: true,
//     title: item.title,
//     width: 800,
//     module: item.id,
//   };
// }

// function CloseModule() {
//   modelParams.value = {
//     visable: false,
//     title: "",
//     width: 800,
//     module: null,
//   };
// }
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

  .demoBoxframe {
    position: relative;
    width: 240px;
    height: 240px;
  }

  .demoBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    margin: 20px;
    padding: 20px;
    border-radius: 6px;
    opacity: 1;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);

    &:hover {
      margin-top: 10px;
      margin-bottom: 30px;
      box-shadow: 0px 4px 10px 0px rgba(0, 115, 255, 0.3);
      transition: margin 0.2s;
    }

    .demoName {
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

    .demoBoxframe {
      position: relative;
      width: 170px;
      height: 170px;
    }

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
        margin-top: 10px;
        margin-bottom: 20px;
        box-shadow: 0px 4px 10px 0px rgba(0, 115, 255, 0.3);
        transition: none;
      }

      .demoName {
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

    .demoBoxframe {
      position: relative;
      width: 170px;
      height: 170px;
    }

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
        margin-top: 10px;
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