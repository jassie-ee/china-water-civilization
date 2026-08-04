# 治理数据接入说明

当前 demo 通过 `src/services/governanceDataSource.ts` 访问治理数据。页面、节点弹窗和积分 Provider 不再直接读取浏览器存储；本地实现仍使用现有题目配置与 `localStorage`，因此不会影响已保存的星级记录。

## 当前本地账户

当前使用 `local-demo-account` 作为演示账户标识。它不展示登录界面，也不上传任何数据；关卡结果继续遵循“每关保留历史最高星级、全站总星级为各关最佳之和”的规则。

## 后端接入边界

未来只需提供一个符合 `GovernanceDataSource` 的 API 实现，并替换默认导出，不需要修改地图、节点详情、答题组件、结果组件或全局积分徽标。

- `getQuestionLevelConfig(levelId)`：从预载的关卡目录读取可进入的关卡。
- `loadProgress(accountId)`：登录后读取账户进度。
- `recordLevelResult(input)`：写入一次答题结果并返回服务端确认后的进度和奖励反馈。

服务端建议单独保存账户、答题记录、关卡最佳成绩和奖励流水。若后续采用“积分无上限”，应由服务端以奖励流水累计；这与当前 demo 的“历史最佳星级”兼容展示，但不在前端直接累加重复闯关奖励。

随机题库也应由服务端根据 `levelId`、用户记录和题目版本返回一组题目，客户端继续消费现有 `GovernanceQuestionLevelConfig` 结构即可。

## 生态视频接入

生态节点使用 `RiverNode.media.video`。视频素材建议放在 `src/assets/videos/nodes/`，并在对应节点数据文件中导入后写入 `src`：

```ts
import wetlandVideo from '@/assets/videos/nodes/yellow-river-delta.mp4';

media: {
  video: {
    title: '黄河三角洲湿地影像',
    description: '候鸟迁徙与河口湿地变化',
    src: wetlandVideo,
  },
},
```

未提供 `src` 时，节点详情自动显示“视频素材后续导入”占位，不会尝试加载空地址。
