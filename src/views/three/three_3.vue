<template>
  <div ref="threeDIV" class="scene"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/addons";
// 导入liu.gui
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/addons";
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
    75, // 视野角度（FOV）。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)
    threeDIVWidth.value / threeDIVHeight.value, // 长宽比（aspect ratio）
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );

  // 设置相机位置
  camera.position.set(0, 1, 4);
  // 将相机添加到场景中
  scene.add(camera);

  // 添加物体
  // 创建纹理加载器
  let textureLoader = new THREE.TextureLoader();
  let texture = textureLoader.load("/src/assets/three3/Bricks075A.png");
  let aomap = textureLoader.load(
    "/src/assets/three3/Bricks075A_1K-JPG_AmbientOcclusion.jpg"
  );
  let rgbeLoader = new RGBELoader();
  rgbeLoader.load("/src/assets/three3/quanjing.hdr", (envMap) => {
    // 设置球形贴图
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.background = envMap;
    scene.environment = envMap;
    // 设置材质的环境贴图
    planeMaterial.envMap = envMap;
  });
  // 添加平面
  let planeGeometry = new THREE.PlaneGeometry(1, 1);
  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    // 贴图纹理
    map: texture,
    // 设置AO（环境遮挡）贴图
    aoMap: aomap,
    // 允许透明
    transparent: true,
    // 反射值
    reflectivity: 0.8,
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, 0, 0);
  scene.add(plane);

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
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

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
  };

  const gui = new GUI();
  gui.add(eventObj, "Fullscreen").name("全屏");
  gui.add(eventObj, "ExitFullscreen").name("退出全屏");
  gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("环境遮挡");
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>