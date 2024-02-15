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
    75, // 视野角度（FOV）。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)
    threeDIVWidth.value / threeDIVHeight.value, // 长宽比（aspect ratio）
    0.1, // 近截面（near）
    1000 // 远截面（far）
  );

  // 设置相机位置
  camera.position.set(0, 1, 4);
  // 将相机添加到场景中
  scene.add(camera);

  // 创建几何体
  const cubeGeometry = new THREE.BufferGeometry();
  //创建顶点数组, 顶点存在顺序 每3个数据为一个坐标 逆时针为正面
  const verties = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0,
    0.0, -1.0, -1.0, 0.0,
  ]);
  // 创建顶点属性
  cubeGeometry.setAttribute("position", new THREE.BufferAttribute(verties, 3));

  // 创建几何体
  const cubeDemo2 = new THREE.BufferGeometry();
  // 按照索引绘制
  const vertiesKey = new Float32Array([
    1.0, 1.0, 0.0, 2.0, 1.0, 0.0, 2.0, 2.0, 0.0, 1.0, 2.0, 0.0,
  ]);
  // 创建顶点属性
  cubeDemo2.setAttribute("position", new THREE.BufferAttribute(vertiesKey, 3));
  // 创建索引 数组代表 vertiesKey 里面顶点的下标
  const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
  // 创建索引属性
  cubeDemo2.setIndex(new THREE.BufferAttribute(indices, 1));
  // 设置2个顶点组形成两个材质
  cubeDemo2.addGroup(0, 3, 0);
  cubeDemo2.addGroup(3, 3, 1);

  // 创建材质
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true, // 设置元素材质为 线框模型
    side: THREE.DoubleSide, // 设置平面图形可以两名都看得见
  });
  const cubeMaterialDemo2 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true, // 设置元素材质为 线框模型
    side: THREE.DoubleSide, // 设置平面图形可以两名都看得见
  });

  // 根据几何体和材质创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const cube2 = new THREE.Mesh(cubeDemo2, [cubeMaterial, cubeMaterialDemo2]);
  // 为几何体设置位置坐标 不设置默认add时 0，0，0
  // .position.x = 2;
  // cube.position.y = 2;
  // cube.position.z = 2;
  cube.position.set(0, 0, 0); // 子元素的坐标位置是以父元素为基准 参考div父级子级关系
  cube.scale.set(1, 1, 1); // 缩放放大
  // 将几何体添加到场景中
  scene.add(cube);
  scene.add(cube2);

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

  gui.add(cubeMaterial, "wireframe").name("线框模式");
  gui.add(cubeMaterial, "side").name("side模式");
  const colorParams = {
    cubeColor: "0xffff00",
  };
  gui
    .addColor(colorParams, "cubeColor")
    .name("子元素颜色")
    .onChange((val) => {
      cube.material.color.set(val);
    });
}
</script>

<style scoped lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
}
</style>