# Supabase 接入说明

1. 创建 Supabase 项目，启用 Anonymous Sign-ins 与 Email provider；竞赛 demo 可关闭邮件确认，以便注册后立即登录。手机号认证需要另行配置 Twilio，因此当前不使用。
2. 在 SQL Editor 依次执行 `supabase/migrations/202608040001_governance_challenge.sql` 与 `supabase/migrations/202608040002_profile_display_name.sql`。
3. 在项目根目录创建 `.env.local`：

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

4. GitHub Pages 在仓库 `Settings → Secrets and variables → Actions → Variables` 中提供同名构建变量；禁止使用 `service_role` 密钥。
5. 首批都江堰题库已生成在 `supabase/seeds/dujiangyan-question-bank.sql`。将其完整粘贴到 SQL Editor 执行；该脚本会校验 40 道 active 题、每题 3 个选项与唯一正确答案后，再发布都江堰关卡。
6. 后续节点仍按 `supabase/seeds/question-bank.template.sql` 的约束导入；确认每关恰有 40 道题后，才将该关 `is_published` 设为 `true`。

未配置环境变量时，网站保持原有本地 demo；演示题不进入 Supabase，也不产生云端积分。

## 竞赛 Demo 的邮箱注册设置

在 Supabase Dashboard 的 `Authentication → Providers → Email` 中关闭 `Confirm email`，使匿名游客升级为邮箱账户后能够立即登录。该设置仅适用于当前竞赛 demo；正式公开服务应重新启用邮箱验证，并单独实现找回密码流程。

## 账户注销函数

账户面板的“注销账户”会永久删除当前登录账户及其云端学习记录。部署前端前，还需要在本机安装并登录 Supabase CLI，然后在项目根目录执行：

```powershell
supabase functions deploy delete-own-account
```

函数源码位于 `supabase/functions/delete-own-account/index.ts`。它仅从 Supabase Edge Function 的服务端环境读取 `SUPABASE_SERVICE_ROLE_KEY`；绝不能把该密钥写入 `.env.local`、GitHub Pages Variables 或前端代码。未部署函数时，注销按钮会显示失败提示，不会删除任何数据。

## 后续节点题库导入

使用 `scripts/prepare_question_bank.py` 生成每个节点的本地 SQL 种子文件。生成文件包含正确答案，受 `.gitignore` 保护，只粘贴到 Supabase SQL Editor，不提交 GitHub。

丹江口水库的本次输出为 `supabase/seeds/danjiangkou-question-bank.sql`。在 SQL Editor 执行后，该关卡会自动发布；前端已登记为云端随机题库。
