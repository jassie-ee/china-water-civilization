import GlbViewer from '@/components/three/GlbViewer';
import lanModelUrl from '@/assets/models/lan/lan-spirit-main-v1.glb?url';

import './ModelDemo.css';

function ModelDemo() {
  return (
    <main className="model-demo">
      <header className="model-demo__header">
        <h1>小澜 3D 模型管线演示</h1>
        <p>
          验证 main 分支小澜形象的 HY3D → 压缩 → three.js 端到端：原始 23 MB → 优化后约 529 KB，
          体积压缩约 44×。拖拽旋转、滚轮缩放，保持页面不自动播放。
        </p>
      </header>

      <section className="model-demo__viewer">
        <GlbViewer
          modelUrl={lanModelUrl}
          ariaLabel="混元3D 生成的小澜水精灵模型"
        />
      </section>

      <section className="model-demo__meta">
        <dl>
          <dt>原始体积</dt>
          <dd>23 MB · HY3D 3.1 · PBR 材质</dd>
          <dt>优化后</dt>
          <dd>529 KB · 32,306 三角面 · 3 张纹理 · EXT_meshopt_compression</dd>
          <dt>管线</dt>
          <dd>
            <code>scripts/optimize-model.mjs</code>:
            纹理优化 → simplify → Meshopt 编码 → weld/dedup/prune
          </dd>
          <dt>前端解码器</dt>
          <dd>three 内置 MeshoptDecoder（已在 GlbViewer 中注册）</dd>
        </dl>
      </section>
    </main>
  );
}

export default ModelDemo;
