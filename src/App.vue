<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  mounted() {
    window.onresize = function() {
        document.body.height = window.innerHeight;
    }
    window.onresize();
    this.$connect();
    let interval = window.setInterval(() => {
      this.$socket.sendObj({ msg: "HEARTBEAT" });
    }, 1000);
    window.addEventListener("beforeunload", () => {
      window.clearInterval(interval);
    });
    this.$options.sockets.onmessage = (msg) => {
      let message = JSON.parse(msg.data);
      console.log(message.msg);
    };
  },
};
</script>
<style lang="scss">
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
// @media screen and (orientation:landscape) {
//   #canvas {
//       width: 1000px;
//       height: 500px;
//       overflow: hidden;
//   }
// }
</style>
