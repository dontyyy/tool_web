<template>
  <div ref="threeDIV" class="scene"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/addons";
// 导入liu.gui
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
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
  camera.position.set(0, 1, 1);
  // 将相机添加到场景中
  scene.add(camera);

  // 添加物体
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const shpereMaterial = new THREE.MeshStandardMaterial();
  const sphere = new THREE.Mesh(sphereGeometry, shpereMaterial);
  sphere.castShadow = true;
  scene.add(sphere);

  // 添加平面
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const plane = new THREE.Mesh(planeGeometry, shpereMaterial);
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
  // 接受阴影
  plane.receiveShadow = true;
  scene.add(plane);

  // 添加灯光
  // 环境光
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  // // 直线光
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(10, 10, 10);
  // // 设置是否开启阴影
  // directionalLight.castShadow = true;
  // // 设置阴影贴图模糊度
  // directionalLight.shadow.radius = 20;
  // // 设置阴影贴图分辨率
  // directionalLight.shadow.mapSize.set(2048, 2048);

  // // 设置平行光相机属性
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 500;
  // directionalLight.shadow.camera.top = 5;
  // directionalLight.shadow.camera.bottom = -5;
  // directionalLight.shadow.camera.left = -5;
  // directionalLight.shadow.camera.right = 6;
  // scene.add(directionalLight);

  // 聚光灯
  const spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(2, 2, 2);
  // 设置是否开启阴影
  spotlight.castShadow = true;
  // 设置阴影贴图模糊度
  spotlight.shadow.radius = 20;
  // 设置阴影贴图分辨率
  spotlight.shadow.mapSize.set(2048, 2048);
  // 设置聚光灯聚焦目标
  spotlight.target = sphere;
  // 设置聚光灯角度
  spotlight.angle = Math.PI / 6;
  // 设置聚光灯衰减距离
  spotlight.distance = 0;

  // 点光
  // const pointLight = new THREE.PointLight(0xffffff, 1);
  // pointLight.position.set(2, 2, 2);
  // // 设置是否开启阴影
  // pointLight.castShadow = true;
  // // 设置阴影贴图模糊度
  // pointLight.shadow.radius = 20;
  // // 设置阴影贴图分辨率
  // pointLight.shadow.mapSize.set(2048, 2048);

  // // 设置平行光相机属性
  // pointLight.shadow.camera.near = 0.5;
  // pointLight.shadow.camera.far = 500;
  const smallLightBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
  );
  smallLightBall.position.set(2, 2, 2);
  smallLightBall.add(spotlight);
  scene.add(smallLightBall);

  // scene.add(spotlight);

  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    // 设置抗锯齿
    antialias: true,
  });
  // 设置渲染的尺寸大小
  renderer.setSize(threeDIVWidth.value, threeDIVHeight.value);
  // 设置开启阴影计算
  renderer.shadowMap.enabled = true;
  // 将webgl渲染的canvas内容添加到body
  threeDIV.value.appendChild(renderer.domElement);

  // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 添加世界坐标辅助器 AxesHelper(坐标系长度)
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置带阻尼的惯性
  controls.enableDamping = true;
  // 设置阻尼系数
  controls.dampingFactor = 0.05;
  // controls.autoRotate = true;

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    let time = clock.getElapsedTime();
    smallLightBall.position.x = Math.sin(time) * 3;
    smallLightBall.position.z = Math.cos(time) * 3;
    smallLightBall.position.y = 2 + Math.sin(time * 10) / 2;
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
  // gui
  //   .add(directionalLight.shadow.camera, "near")
  //   .min(0)
  //   .max(20)
  //   .step(0.1)
  //   .onChange(() => {
  //     directionalLight.shadow.camera.updateProjectionMatrix();
  //   });
  gui.add(sphere.position, "x").min(0).max(20).step(1).name("球X位置");
  gui
    .add(spotlight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01)
    .name("聚光灯角度");
  gui
    .add(spotlight, "distance")
    .min(0)
    .max(20)
    .step(0.1)
    .name("聚光灯衰减距离");
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>