module.exports = {
  filenameHashing: false,

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },

  lintOnSave: false,

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Cook";
      return args;
    });
    config.module
      .rule("pdf")
      .test(/\.pdf$/)
      .use("file-loader")
      .loader("file-loader");
  }
};
