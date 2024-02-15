<template>
  <div ref="threeDIV" class="scene"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/addons";
// 导入liu.gui
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// 导入 gltf 加载器
import { GLTFLoader } from "three/addons";
// 导入hdr加载器
import { RGBELoader } from "three/addons";
// 导入解析器
import { DRACOLoader } from "three/addons";
// 导入 tween 动画库
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
const threeDIV = ref();
const threeDIVWidth = ref();
const threeDIVHeight = ref();

onMounted(() => {
  setTimeout(function () {
    Init();
  }, 200);
});

function Init() {
  threeDIVWidth.value = threeDIV.value.clientWidth - 1;
  threeDIVHeight.value = threeDIV.value.clientHeight - 1;
  // 1、创建场景
  const scene = new THREE.Scene();

  // 2、创建相机
  const camera = new THREE.PerspectiveCamera(
    90, // 视野角度（FOV）。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)
    threeDIVWidth.value / threeDIVHeight.value, // 长宽比（aspect ratio）
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );

  // 设置相机位置
  camera.position.set(0, 120, 300);
  // 将相机添加到场景中
  scene.add(camera);

  // 添加物体
  // 实例化加载器 gltf
  const gltfloader = new GLTFLoader();

  // 实例化 DRACOLoader 解析器
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/src/draco/");
  gltfloader.setDRACOLoader(dracoLoader);

  let tween: TWEEN.Tween<any>;
  let tween2: TWEEN.Tween<any>;
  // 加载模型
  gltfloader.load("/src/assets/three5/moxing.gltf", (gltf) => {
    // console.log(gltf);
    gltf.scene.position.set(0, -50, 0);
    scene.add(gltf.scene);
    //tween补间动画
    tween = new TWEEN.Tween(gltf.scene.position).onUpdate(() => {
      // console.log(gltf.scene.position.y);
    });
    tween.to({ y: 120 }, 2000);
    // 循环无限次
    // tween.repeat(Infinity);
    // 循环往复
    // tween.yoyo(true);
    // 延迟1秒后运行
    tween.delay(1000);
    // 设置缓动函数
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();

    tween2 = new TWEEN.Tween(gltf.scene.position).onUpdate(() => {
      // console.log(gltf.scene.position.y);
    });
    tween2.to({ x: -240 }, 2000);
    tween.chain(tween2);
    tween2.chain(tween);
  });

  // 设置环境贴图
  let rgbeLoader = new RGBELoader();
  rgbeLoader.load("/src/assets/three3/quanjing.hdr", (envMap) => {
    // 设置球形贴图
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.environment = envMap;
  });

  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    // 设置抗锯齿
    antialias: true,
  });
  // 设置渲染的尺寸大小
  renderer.setSize(threeDIVWidth.value, threeDIVHeight.value);
  // 将webgl渲染的canvas内容添加到body
  threeDIV.value.appendChild(renderer.domElement);

  // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 添加世界坐标辅助器 AxesHelper(坐标系长度)
  // const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置带阻尼的惯性
  controls.enableDamping = true;
  // 设置阻尼系数
  controls.dampingFactor = 0.05;
  // controls.autoRotate = true;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    // 旋转
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    // 重新渲染宽高比
    renderer.setSize(threeDIVWidth.value, threeDIVHeight.value);
    // 重置相机宽高比
    camera.aspect = threeDIVWidth.value / threeDIVHeight.value;
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
  });

  // GUI 调试工具
  const eventObj = {
    Fullscreen: function () {
      document.body.requestFullscreen();
    },
    ExitFullscreen: function () {
      document.exitFullscreen();
    },
    Stop: function () {
      tween.stop();
    },
    Start: function () {
      tween.start();
    },
  };

  const gui = new GUI();
  gui.add(eventObj, "Fullscreen").name("全屏");
  gui.add(eventObj, "ExitFullscreen").name("退出全屏");
  gui.add(eventObj, "Start").name("开始运动");
  gui.add(eventObj, "Stop").name("停止运动");
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>