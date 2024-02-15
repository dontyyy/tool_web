<template>
  <div ref="threeDIV" class="scene"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { Box3 } from "three";
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
    75, // 视野角度（FOV）。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)
    threeDIVWidth.value / threeDIVHeight.value, // 长宽比（aspect ratio）
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );

  // 设置相机位置
  camera.position.set(0, 0, 10);
  // 将相机添加到场景中
  scene.add(camera);

  // 添加物体
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    })
  );
  sphere1.position.set(-2, 0, 0);
  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
    })
  );
  sphere2.position.set(0, 2, 0);
  const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
  );
  sphere3.position.set(2, 0, 0);
  scene.add(sphere1);
  scene.add(sphere2);
  scene.add(sphere3);

  // 创建多物体包围盒
  let morebox = new THREE.Box3();
  let sceneChilds = scene.children || [];
  sceneChilds.map((item) => {
    if (item.type === "Mesh") {
      // let childGeometry = (item.getObjectById(item.id) as THREE.Mesh).geometry;
      // 计算包围盒
      // childGeometry.computeBoundingBox();
      // // 获取包围盒
      // let boundingBox = childGeometry.boundingBox;
      // // console.log(duckboundingBox);
      // // 更新世界矩阵
      // item?.updateWorldMatrix(true, true);
      // // 更新包围盒
      // boundingBox?.applyMatrix4(item?.matrixWorld);

      // 第二种方式
      let boundingBox = new THREE.Box3().setFromObject(item);
      morebox.union(boundingBox as Box3);
    }
  });
  // 创建包围盒辅助器
  let boxHelper = new THREE.Box3Helper(morebox, 0xffff00);
  scene.add(boxHelper);

  // 创建射线
  const raycaster = new THREE.Raycaster();
  // 创建鼠标向量
  const mouse = new THREE.Vector2();

  window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / threeDIVWidth.value) * 2 - 1;
    mouse.y = -((event.clientY / threeDIVHeight.value) * 2 - 1);
    // console.log(mouse.x, mouse.y);

    // 通过摄像机与鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera);

    // 计算物体和射线的焦点
    const intersect = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    if (intersect.length > 0) {
      (
        (intersect[0].object as THREE.Mesh).material as THREE.MeshBasicMaterial
      ).color.set(0xff0000);
    }
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
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>