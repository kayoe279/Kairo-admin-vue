# 🚀 Kairo Admin

`Kairo Admin` 是一个基于 Vue3 + Vite + Naive UI + TypeScript 的现代化中后台管理系统模板。该项目提供了完整的后台管理解决方案，包含权限管理、数据展示、表单处理等常见业务功能。

## ✨ 特性

- 🎨 **现代化 UI** - 基于 Naive UI 组件库，提供美观且易用的界面
- 📱 **响应式设计** - 完美适配各种屏幕尺寸，移动端友好
- 🔐 **权限控制** - 内置完善的权限系统，支持角色和权限管理
- 🌍 **国际化支持** - 内置中英文语言切换功能
- 🎯 **TypeScript** - 全面的类型支持，提供更好的开发体验
- 🎪 **组件丰富** - 二次封装的常用组件，开箱即用
- 🎭 **Mock 数据** - 内置 Mock 数据支持，便于开发和测试
- 📊 **数据图表** - 集成 ECharts，支持各种数据可视化

## 🛠️ 技术栈

- **框架**: Vue 3.5 + TypeScript
- **构建工具**: Vite 6.1
- **UI 组件库**: Naive UI 2.41
- **状态管理**: Pinia + 持久化插件
- **路由**: Vue Router 4.5
- **样式**: Tailwind CSS 4.0
- **HTTP 客户端**: Alova 3.2
- **国际化**: Vue I18n 11.1
- **图表**: ECharts 5.6
- **Mock**: Mock.js + Alova Mock

## 📦 功能模块

### 仪表盘

- 📊 **控制台** - 数据概览、统计图表、快捷操作
- 💼 **工作台** - 个人工作台、项目管理、任务提醒
- 📈 **监控页面** - 系统监控、性能指标

### 表单页面

- 📝 **基础表单** - 常见表单组件展示
- 📋 **表单详情** - 只读信息展示
- 📄 **步骤表单** - 多步骤表单处理

### 列表页面

- 📋 **基础列表** - 数据列表展示、分页、搜索

### 权限系统

- 🔐 **权限示例** - 角色切换、权限演示
- 👥 **权限管理** - 用户、角色、权限管理

### 系统设置

- 👤 **账户设置** - 个人信息、安全设置
- ⚙️ **系统设置** - 系统配置、显示设置、邮件配置

### 组件示例

- 📊 **表格组件** - 可编辑表格、行内编辑
- 📝 **表单组件** - 动态表单、表单验证
- 📤 **上传组件** - 图片上传、文件上传
- 📝 **富文本编辑器** - 基于 vue-quill 的编辑器

### 异常页面

- 🚫 **403** - 无权限访问
- 🔍 **404** - 页面不存在
- ⚠️ **500** - 服务器错误

## 🏗️ 项目结构

```
src/
├── assets/              # 静态资源
├── components/          # 组件
│   ├── atoms/          # 原子组件
│   ├── molecules/      # 分子组件
│   └── features/       # 功能组件
├── directives/         # 自定义指令
├── hooks/              # 组合式函数
├── layouts/            # 布局组件
├── lib/                # 工具库
├── locales/            # 国际化文件
├── plugins/            # 插件配置
├── router/             # 路由配置
├── service/            # API 接口
├── store/              # 状态管理
├── styles/             # 全局样式
├── types/              # 类型定义
└── views/              # 页面组件
```

## 📋 环境要求

- Node.js 22.x
- Bun >= 1.2.8 (推荐) 或 npm/yarn

## 🚀 快速开始

### 获取项目

```bash
git clone https://github.com/kayoe279/vue3-admin-nativeui-template.git
cd vue3-admin-nativeui-template
```

### 安装依赖

```bash
# 使用 bun (推荐)
bun install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 开发环境
bun dev

# 或使用 npm
npm run dev
```

### 构建生产版本

```bash
# 构建
bun build

# 预览构建结果
bun preview
```

## 🔧 其他脚本

```bash
# 类型检查
bun typecheck

# 代码格式化
bun format

# 代码检查
bun lint

# 代码检查并修复
bun lint:fix

# 清理缓存
bun clean:cache
```

## 📝 开发指南

### 新增页面

1. 在 `src/views/` 目录下创建页面组件
2. 在 `src/router/modules/` 中添加路由配置
3. 如需菜单显示，在 `mock/system/menu.ts` 中配置菜单项

### 权限控制

项目支持两种权限控制方式：

1. **指令方式**: 使用 `v-permission` 指令
2. **函数方式**: 使用 `usePermission` 组合式函数

### 国际化

在 `locales/` 目录下添加对应的语言文件，支持中英文切换。

## 🎨 主题定制

项目支持主题定制，可以通过设置面板调整：

- 主题色彩
- 布局模式
- 导航样式
- 动画效果

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 提交规范

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码风格
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

## 🌐 浏览器支持

- Chrome >= 80
- Firefox >= 78
- Safari >= 14
- Edge >= 80

## 📄 许可证

本项目基于 MIT 许可证开源。

## 👥 维护者

[@Kayoe](https://github.com/kayoe279)

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
