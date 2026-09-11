# 第一章引导影像

将“源”印记点击后播放的原始视频保留在本目录，便于本地管理；不要提交到 Git。

发布前，请在 GitHub 建立 tag 为 `video-assets` 的 Release，并上传本视频，附件名必须为：

- `chapter-one-intro.mp4`

网页会将本目录的压缩视频作为前端静态资源打包并部署；请在 `src/assets/videos/mediaSources.ts` 中注册其文件名。

可选海报文件命名为 `intro-poster.webp`、`intro-poster.png`、`intro-poster.jpg` 或 `intro-poster.jpeg`。
