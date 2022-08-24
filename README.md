# think

## 简介

Think 是一款开源知识管理工具。通过独立的知识库空间，结构化地组织在线协作文档，实现知识的积累与沉淀，促进知识的复用与流通。同时支持多人协作文档。使用的技术如下：

- `MySQL`：数据存储
- `next.js`：前端页面框架
- `nest.js`：服务端框架
- `tiptap`：编辑器及文档协作

可访问[云策文档帮助中心](https://think.codingit.cn/share/wiki/WoiR8N5uj4i7)，查看更多功能文档。

## 链接

[云策文档](https://think.codingit.cn)已经部署上线，可前往注册使用。

## 交流群

欢迎进群交流。

<img width="300" alt="image" src="https://user-images.githubusercontent.com/26452939/186061489-a1f6719f-813a-428c-ab7b-8229906fa271.PNG">

## 预览

<details>
  <summary>查看预览图</summary>
  <img alt="知识库" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYP8X/image.png" width="420" />
  <img alt="新建文档" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPQX/image.png" width="420" />
  <img alt="编辑器" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-20/YN67GM4VQMBTZFZ88TYPZX/image.png" width="420" />
</details>

## 项目开发

[项目开发说明](./let-us-start.md)。

## 自动化部署

> 思路：在服务器部署 webhook，然后在 github setting 中配置相应钩子，实现自动化部署

参考：[webhook](https://github.com/adnanh/webhook/blob/master/docs/Hook-Examples.md#incoming-github-webhook)
