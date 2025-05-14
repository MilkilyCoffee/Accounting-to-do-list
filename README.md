# 记账本小程序

一个基于微信小程序平台开发的个人记账和待办事项管理应用。

## 功能特点

### 记账功能
- 支持收入支出记录
- 多维度数据筛选（日期、金额、内容）
- 智能数据统计
- 自定义排序功能

### 待办事项
- 任务创建与管理
- 时间规划
- 状态追踪
- 任务筛选

### 其他特性
- 数据本地持久化存储
- 分享功能（支持分享给好友和朋友圈）
- 响应式界面设计
- 流畅的用户体验

## 技术栈

- 微信小程序原生框架
- WXML + WXSS + JavaScript
- 微信小程序Storage API
- 组件化开发

## 项目结构

```
├── pages/                # 页面文件
│   ├── index/           # 首页（记账功能）
│   ├── todo/            # 待办事项页面
│   └── add/             # 添加记录页面
├── images/              # 图片资源
├── utils/               # 工具函数
├── app.js              # 应用入口
├── app.json            # 应用配置
└── app.wxss            # 全局样式
```

## 安装和使用

1. 克隆项目
```bash
git clone [项目地址]
```

2. 使用微信开发者工具打开项目

3. 在微信开发者工具中预览和调试

## 开发环境

- 微信开发者工具
- Node.js
- 微信小程序基础库 2.30.0 或以上

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有任何问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至：[milkmikufans@gmail.com]
