# 小澜 Live2D Web 模型目录

Cubism Editor 导出的 Web 模型包请原样放在此目录，不要拆散模型内部的相对路径。

预期入口：

```text
public/live2d/lan/
├─ lan.model3.json
├─ lan.moc3
├─ lan.physics3.json
├─ textures/
├─ motions/
└─ expressions/
```

模型入口 URL 将是：

```text
${import.meta.env.BASE_URL}live2d/lan/lan.model3.json
```

在 `lan.model3.json` 到位前，网页继续使用现有 PNG 精灵，不会产生缺失资源请求。
