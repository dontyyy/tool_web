<template>
  <div ref="threeDIV" class="scene"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/addons";
// 导入liu.gui
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// const props = defineProps({
//   /* 编辑器的内容 */
//   modelValue: {
//     type: String,
//   },
// });

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
  console.log(threeDIVWidth.value, threeDIVHeight.value);
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
  // 创建几何体
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建材质
  const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const cubeMaterial3 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cubeMaterial4 = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cubeMaterial5 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeMaterial6 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  // 创建父元素材质
  const parentcubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  // 设置父元素材质为 线框模型
  parentcubeMaterial.wireframe = true;
  // 创建父级几何体
  const parentCube = new THREE.Mesh(cubeGeometry, parentcubeMaterial);
  // 根据几何体和材质创建物体
  const cube = new THREE.Mesh(cubeGeometry, [
    cubeMaterial1,
    cubeMaterial2,
    cubeMaterial3,
    cubeMaterial4,
    cubeMaterial5,
    cubeMaterial6,
  ]);
  // 将 子元素cube 添加到父元素 parentCube
  parentCube.add(cube);
  // 为几何体设置位置坐标 不设置默认add时 0，0，0
  // parentCube.position.x = 2;
  // parentCube.position.y = 2;
  // parentCube.position.z = 2;
  parentCube.position.set(0, 0, 0);

  cube.position.set(2, 0, 0); // 子元素的坐标位置是以父元素为基准 参考div父级子级关系
  cube.scale.set(1.5, 1.5, 1.5); // 缩放放大

  // 将几何体添加到场景中
  scene.add(parentCube);

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
  // 控制立方体位置
  let folder = gui.addFolder("位置");
  folder
    .add(cube.position, "x", -5, 5)
    .name("立方体位置")
    .onChange((val) => {
      console.log(val);
    });
  folder
    .add(cube.position, "x")
    .min(-10)
    .max(10)
    .step(1)
    .name("立方体位置")
    .onChange((val) => {
      console.log(val);
    })
    .onFinishChange((val) => {
      console.log("最终改变事件触发" + val);
    });

  gui.add(parentcubeMaterial, "wireframe").name("父元素线框模式");
  const colorParams = {
    cubeColor: "0xffff00",
  };
  gui
    .addColor(colorParams, "cubeColor")
    .name("元素颜色")
    .onChange((val) => {
      parentCube.material.color.set(val);
    });
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>