# 🚀 Kairo Admin

`Kairo Admin` 是一个基于 Vue3 + Vite + Naive UI + TypeScript 的现代化中后台管理系统模板。该项目提供了完整的后台管理解决方案，包含权限管理、数据展示、表单处理、业务模块等企业级功能。

测试账号: kayoe279@qq.com  密码: Qwe123456+

## ✨ 特性

- 🎨 **现代化 UI** - 基于 Naive UI 组件库，提供美观且易用的界面
- 📱 **响应式设计** - 完美适配各种屏幕尺寸，移动端友好
- 🔐 **权限控制** - 内置完善的 RBAC 权限系统，支持角色和权限精细化管理
- 🌍 **国际化支持** - 内置中英文语言切换功能，支持动态语言包
- 🎯 **TypeScript** - 全面的类型支持，提供更好的开发体验和代码质量
- 🎪 **组件丰富** - 二次封装的常用组件，包含表格、表单、上传、图表等
- 🗄️ **数据库集成** - 基于 Supabase 的现代化 BaaS 解决方案
- 🔄 **数据请求** - Vue Query 强大的异步状态管理
- 📊 **数据图表** - 集成 ECharts，支持各种数据可视化需求
- 🏗️ **工程化完善** - 集成 ESLint、Prettier、Commitlint 等开发工具
- 📦 **模块化设计** - 清晰的代码结构，模块化的功能组织

## 🛠️ 技术栈

- **框架**: Vue 3.5.13 + TypeScript 5.7.3
- **构建工具**: Vite 6.1.0 + Bun 1.2.8
- **UI 组件库**: Naive UI 2.41.0
- **状态管理**: Pinia 2.3.1 + 持久化插件 4.2.0
- **路由**: Vue Router 4.5.0
- **样式**: Tailwind CSS 4.0.4
- **数据库**: Supabase 2.57 (PostgreSQL + Auth + Storage)
- **数据请求**: Vue Query 5.90 (TanStack Query)
- **国际化**: Vue I18n 11.1.1
- **图表**: ECharts 5.6.0 + Vue-ECharts 7.0.3
- **工具库**: Lodash-ES 4.17.21 + VueUse 12.5.0
- **开发工具**: ESLint 9.19 + Prettier 3.4.2 + Commitlint

## 📦 功能模块

### 仪表盘模块

- 📊 **工作台** - 个人工作台，数据概览和快捷操作
- 📈 **数据分析** - 数据统计图表，业务指标分析
- 📱 **实时监控** - 系统监控，性能指标实时展示

### 业务管理模块

- 👥 **客户管理** - 客户列表、详情、分组和客服功能
- 📦 **产品管理** - 产品列表、详情、分类、品牌和库存管理
- 📋 **订单管理** - 订单列表、详情、退款和物流管理

### 系统管理模块

- 👤 **用户管理** - 用户列表、详情和权限分配
- 🏢 **部门管理** - 部门架构、详情和层级管理
- 🎭 **角色管理** - 角色列表、详情和权限配置
- 📋 **菜单管理** - 菜单列表、详情和权限控制

### 权限系统

- 🔐 **权限示例** - 角色切换、权限演示和测试
- 👑 **超级管理** - 超级权限管理和系统配置

### 个人设置

- 👤 **账户设置** - 个人信息和基本资料
- 🔒 **安全设置** - 密码修改、安全验证
- 🎨 **主题设置** - 界面主题、颜色和布局配置

### 组件示例

- 📊 **图表组件** - 柱状图、折线图、饼图等数据可视化
- 📝 **表单组件** - 基础表单、高级表单、步骤表单、表单验证
- 📋 **表格组件** - 基础表格、高级表格、可编辑表格、虚拟表格
- 📤 **上传组件** - 文件上传、图片上传、拖拽上传
- 📝 **富文本编辑器** - 基于 vue-quill 的富文本编辑
- 🎭 **指令示例** - 自定义指令演示和使用
- 🎯 **拖拽组件** - 列表拖拽、排序功能

### 异常页面

- 🚫 **403** - 无权限访问页面
- 🔍 **404** - 页面不存在
- ⚠️ **500** - 服务器错误页面

### 其他功能

- 📄 **关于页面** - 项目介绍和版本信息
- 🖼️ **内嵌页面** - iframe 页面嵌入功能

## 🏗️ 项目结构

```
src/
├── assets/              # 静态资源
│   ├── icons/          # SVG 图标文件
│   └── images/         # 图片资源
├── components/          # 组件库
│   ├── features/       # 业务功能组件
│   │   ├── settings/   # 设置相关组件
│   │   └── user/       # 用户相关组件
│   └── ui/             # 基础 UI 组件
│       ├── Chart/      # 图表组件
│       ├── Form/       # 表单组件
│       ├── Table/      # 表格组件
│       └── Upload/     # 上传组件
├── directives/         # 自定义指令
│   ├── clickOutside.ts # 点击外部指令
│   ├── copy.ts         # 复制指令
│   ├── debounce.ts     # 防抖指令
│   ├── draggable.ts    # 拖拽指令
│   └── permission.ts   # 权限指令
├── hooks/              # 组合式函数
│   ├── useMenu.ts      # 菜单相关
│   ├── usePermission.ts # 权限相关
│   └── useTable.ts     # 表格相关
├── layouts/            # 布局组件
├── lib/                # 工具库
│   ├── constants/      # 常量定义
│   ├── settings/       # 设置配置
│   └── utils/          # 工具函数
├── plugins/            # 插件配置
├── router/             # 路由配置
│   └── modules/        # 路由模块
├── service/            # API 接口
├── store/              # 状态管理 (Pinia)
├── styles/             # 全局样式
├── types/              # TypeScript 类型定义
└── views/              # 页面组件
    ├── dashboard/      # 仪表盘页面
    ├── business/       # 业务管理页面
    ├── system/         # 系统管理页面
    ├── examples/       # 组件示例页面
    ├── permissions/    # 权限相关页面
    ├── setting/        # 个人设置页面
    └── exception/      # 异常页面
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
3. 在路由配置中添加相应的 meta 信息（title、icon、权限等）
4. 如需菜单显示，确保路由配置正确且用户有相应权限

### 权限控制

项目支持多种权限控制方式：

1. **指令方式**: 使用 `v-permission` 指令控制元素显示
2. **函数方式**: 使用 `usePermission` 组合式函数进行权限判断
3. **路由守卫**: 在路由层面进行权限拦截
4. **组件级权限**: 在组件内部进行权限控制

### 国际化

- 在 `locales/` 目录下添加对应的语言文件
- 支持中英文动态切换
- 使用 Vue I18n 进行国际化管理
- 组件和页面均支持多语言

### 自定义指令

项目内置多个自定义指令：

- `v-copy`: 复制文本到剪贴板
- `v-debounce`: 防抖处理
- `v-draggable`: 拖拽功能
- `v-click-outside`: 点击外部区域
- `v-permission`: 权限控制

## 🎨 主题定制

项目提供强大的主题定制功能：

### 主题配置

- **主题色彩**: 支持自定义主题颜色，内置多种预设色彩
- **深色模式**: 支持浅色/深色主题切换
- **布局模式**: 多种布局模式选择（侧边栏、顶部导航等）
- **动画效果**: 可配置页面切换和组件动画

### 样式定制

- **Tailwind CSS**: 使用 Tailwind CSS 4.0 进行样式开发
- **CSS 变量**: 支持 CSS 变量动态修改主题
- **组件样式**: Naive UI 组件主题完全可定制
- **颜色系统**: 完整的设计系统颜色配置

### 个性化设置

- **用户偏好**: 个人主题设置持久化存储
- **实时预览**: 主题修改实时生效
- **重置功能**: 一键恢复默认主题设置

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

| 浏览器  | 版本  |
| ------- | ----- |
| Chrome  | >= 80 |
| Firefox | >= 78 |
| Safari  | >= 14 |
| Edge    | >= 80 |

## ⚡ 性能特性

- **代码分割**: 路由级别的代码分割，按需加载
- **组件懒加载**: 大型组件支持异步加载
- **缓存策略**: 智能缓存策略，提升页面加载速度
- **构建优化**: Vite 构建优化，快速开发和部署
- **Tree Shaking**: 自动移除未使用的代码
- **资源压缩**: 自动压缩 JavaScript、CSS 和图片资源

## 📄 许可证

本项目基于 MIT 许可证开源。

## 👥 维护者

[@Kayoe](https://github.com/kayoe279)

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
