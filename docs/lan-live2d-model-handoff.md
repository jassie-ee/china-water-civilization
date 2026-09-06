# 小澜 Live2D 模型交付规范

## 优先交付原始分层文件

优先提供 PSD，而不是提前导出的一组 PNG。PSD 必须满足：

- 透明背景，保持原始画布尺寸和角色位置；
- 一个可独立运动的部位对应一个图层；
- 不合并左右眼、左右手或不同水流；
- 被其他部位遮挡的内容已经补画完整；
- 半透明水流保留原始透明度，不使用纯色背景垫底；
- 图层名称唯一，避免 `图层 1 副本` 之类无法辨认的命名；
- 不裁切画布边缘的水流、手臂和装饰。

## 建议图层清单

```text
00_reference
10_head_base
11_face_highlight
12_face_shadow
20_eye_L_white
21_eye_L_iris
22_eye_L_upper_lid
23_eye_L_lower_lid
24_eye_R_white
25_eye_R_iris
26_eye_R_upper_lid
27_eye_R_lower_lid
30_brow_L
31_brow_R
32_mouth
40_body
41_arm_L
42_hand_L
43_arm_R
44_hand_R
50_collar_front
51_chest_ornament
60_water_back_01...
70_water_front_01...
80_highlight_front
90_shadow
```

同一只眼睛如果原画已经包含眼白、瞳孔、高光，也应继续拆开，以便实现眨眼和视线跟随。

## 首版模型参数

首版至少需要以下参数或等价参数：

| 用途 | 建议参数 |
| --- | --- |
| 头部朝向 | `ParamAngleX/Y/Z` |
| 身体倾斜 | `ParamBodyAngleX/Z` |
| 眨眼 | `ParamEyeLOpen`、`ParamEyeROpen` |
| 视线 | `ParamEyeBallX/Y` |
| 嘴部 | `ParamMouthOpenY`、`ParamMouthForm` |
| 呼吸 | `ParamBreath` |

水流、衣领和挂饰应配置物理摆动，以便鼠标跟随和拖动时产生延迟感。

## 首版动作与表情

模型状态需要和网站现有状态对齐：

| 网站状态 | Live2D 表现 |
| --- | --- |
| `happy` | 明亮表情、轻微跳跃或挥手 |
| `thinking` | 视线侧移、身体轻摆、思考表情 |
| `turbid` | 低落表情、动作变慢、颜色或高光减弱 |

建议动作文件：`idle`、`tap`、`drag`、`happy`、`thinking`、`turbid`。其中 `idle` 应可循环，其余动作播放后回到 `idle`。

## Cubism 导出交付物

完成绑定后，请从 Cubism Editor 导出适用于 Cubism SDK for Web 的模型包，并保持目录结构不变。最低交付入口是 `lan.model3.json`；其引用的 `.moc3`、贴图、物理、动作和表情文件必须一并提供。

前端会将整个模型包放入 `public/live2d/lan/`，并保留现有 PNG 作为加载失败、减少动画模式和低性能设备的降级显示。
