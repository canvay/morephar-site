const config = {
  locales: ["zh-Hans", "zh"],
  translations: {
    "zh-Hans": {
      // 自定义翻译键值对
      "content-manager.plugin.name": "内容管理器",
      "seo.plugin.name": "SEO",
      "seo.SEOPage.tab.plugin-title": "SEO",
      "Information": "信息",
      "Author": "作者",
      "Category": "分类",
      "Lead form submission": "表单提交",
      "Page": "页面",
      "Product": "产品",
      "User": "用户",
      "Global": "全局",
    },
  },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
