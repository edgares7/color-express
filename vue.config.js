module.exports = {
  filenameHashing: false,

  lintOnSave: false,

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Cook";
      return args;
    });
  }
};