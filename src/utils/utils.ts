// 获取assets静态资源
export const getAssetsFile = (folder: string, url: string, type = 'png') => {
  const path = `/src/assets/${folder}/${url}.${type}`;
  const modules: Record<string, any> = import.meta.glob(`@/assets/**/*.{png,svg,jpg,jpeg}`, { eager: true });
  if (modules[path]) return modules[path].default;
  else {
    // 地址错误
    console.error("Error url is wrong path");
  }
};