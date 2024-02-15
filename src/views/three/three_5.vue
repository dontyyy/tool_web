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
  camera.position.set(0, 2, 6);
  // 将相机添加到场景中
  scene.add(camera);

  // 添加物体
  // 实例化加载器 gltf
  const gltfloader = new GLTFLoader();

  // 实例化 DRACOLoader 解析器
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/src/draco/");
  gltfloader.setDRACOLoader(dracoLoader);

  // 加载城市压缩模型
  gltfloader.load("/src/assets/three5/assisi_city_scene.glb", (gltf) => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    scene.add(gltf.scene);
    console.log(gltf.scene);
    // 遍历城市
    gltf.scene.traverse((item) => {
      if ((item as THREE.Mesh).isMesh) {
        let geometry = (item as THREE.Mesh).geometry;
        // 获取边缘几何体
        let edgsgeometry = new THREE.EdgesGeometry(geometry);
        // 创建线段材质
        let edgsMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
        });
        // 创建线段
        const edgsbox = new THREE.LineSegments(edgsgeometry, edgsMaterial);
        // 更新物体世界转换矩阵
        gltf.scene.updateWorldMatrix(true, true);
        edgsbox.matrix.copy(gltf.scene.matrixWorld);
        // 解构跟随更新
        edgsbox.matrix.decompose(
          edgsbox.position,
          edgsbox.quaternion,
          edgsbox.scale
        );
        // console.log(item.parent?.rotation.x);
        // edgsbox.rotation.set(
        //   item.parent?.rotation.x || 0,
        //   item.parent?.rotation.y || 0,
        //   item.parent?.rotation.z || 0
        // );
        scene.add(edgsbox);
      }
    });
  });

  // 加载模型
  gltfloader.load("/src/assets/three5/duck.gltf", (gltf) => {
    // console.log(gltf);
    gltf.scene.position.set(0, 1, 1);
    scene.add(gltf.scene);

    let duckmesh = gltf.scene.getObjectByName("Scene");
    // console.log(duckmesh);
    let duckGeometry: any;
    // 判断是 模型还是模型组
    if ((duckmesh as THREE.Mesh).type === "Group") {
      if ((duckmesh as THREE.Mesh)?.children.length > 0) {
        duckGeometry = ((duckmesh as THREE.Mesh).children[0] as THREE.Mesh)
          .geometry;
        // 计算包围盒
        duckGeometry.computeBoundingBox();
        // 获取包围盒
        let duckboundingBox = duckGeometry.boundingBox;
        // console.log(duckboundingBox);
        // 更新世界矩阵
        duckmesh?.updateWorldMatrix(true, true);
        // 更新包围盒
        duckboundingBox.applyMatrix4(duckmesh?.matrixWorld);
        // 创建包围盒辅助器
        let boxHelper = new THREE.Box3Helper(duckboundingBox, 0xffff00);
        scene.add(boxHelper);

        let geometry = ((duckmesh as THREE.Mesh).children[0] as THREE.Mesh)
          .geometry;
        // 获取边缘几何体
        let edgsgeometry = new THREE.EdgesGeometry(geometry);
        // 创建线段材质
        let edgsMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
        });
        // 创建线段
        const edgsbox = new THREE.LineSegments(edgsgeometry, edgsMaterial);
        // 更新物体世界转换矩阵
        duckmesh?.updateWorldMatrix(true, true);
        edgsbox.matrix.copy((duckmesh as THREE.Mesh).matrixWorld);
        // 解构跟随更新
        edgsbox.matrix.decompose(
          edgsbox.position,
          edgsbox.quaternion,
          edgsbox.scale
        );
        scene.add(edgsbox);
      }
    } else {
      duckGeometry = (duckmesh as THREE.Mesh).geometry;
      // 计算包围盒
      duckGeometry.computeBoundingBox();
      // 获取包围盒
      let duckboundingBox = duckGeometry.boundingBox;
      console.log(duckboundingBox);
    }
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
  const axesHelper = new THREE.AxesHelper(100);
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