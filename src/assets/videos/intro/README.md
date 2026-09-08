# 启动序章视频素材

原始视频可保留在本目录备份，但不会提交到 Git。

- `intro.mp4`：8 秒启动序章视频；上传到 GitHub tag 为 `video-assets` 的 Release 时，附件名必须改为 `site-intro.mp4`。
- `intro-poster.webp`：与视频结尾一致的静帧；也支持 `.png`、`.jpg`、`.jpeg`。

网页通过 Release 按需读取 `site-intro.mp4`。视频静音自动播放；结束后显示标题和“开始探索”。系统开启减少动态效果或视频加载失败时，将显示结尾静帧。
