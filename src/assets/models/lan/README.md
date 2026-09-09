# 澜澜 3D 模型资源

这里放网页最终使用的 GLB/GLTF 文件。

建议流程：

1. 从 WorkBuddy 的 HY3D 导出原始模型到项目根目录外的 `assets-source/3d/lan/`。
2. 用项目内置脚本压缩为可发布版本（详见 `scripts/optimize-model.mjs`）：
   ```bash
   node scripts/optimize-model.mjs \
     --in assets-source/3d/lan/lan-spirit-raw.glb \
     --out src/assets/models/lan/lan-spirit-v1.glb \
     --texture-size 1024 --simplify-ratio 0.25
   ```
   脚本会做：纹理 → 1024px WebP（法线贴图自动 +8 质量）、MeshoptSimplifier 减面、
   MeshoptEncoder 几何压缩、weld/dedup/prune。`GlbViewer` 已注册 MeshoptDecoder，前端无需额外配置。
3. 在 React 页面中把导入后的 URL 传给 `GlbViewer` 的 `modelUrl`；模型如果内嵌动画，会自动播放。

示例：

```tsx
import GlbViewer from '@/components/three/GlbViewer';
import lanModelUrl from '@/assets/models/lan/lan-spirit-v1.glb?url';

<GlbViewer modelUrl={lanModelUrl} autoRotate />
```

GLB 是可交互的 3D 模型格式；静态或循环展示图请放到 `src/assets/images/lan/renders/`，不要把模型文件转成 WebP。

本次小澜模型实测：23 MB 原始 GLB / 32,306 个三角面 → 529 KB 发布版（约 44× 压缩）；
发布版保留 3 张纹理、`KHR_materials_specular` 与 Meshopt 几何压缩，适合网页实时预览。
