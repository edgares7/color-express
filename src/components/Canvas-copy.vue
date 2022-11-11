t
<template>
  <div id="canvas"></div>
</template>

<script>
import * as PIXI from "pixi.js";
export default {
  name: "Canvas",
  data() {
    return {
      x: null,
      y: null,
      colors: [
        "0x8bd4df",
        "0x005289",
        "0xa37db8",
        "0xed77ae",
        "0xfba92c",
        "0xb7d87a",
        "0x702f72",
        "0x702f72",
        "0x1575ba",
        "0xef3b47",
        "0xdb1e84",
      ],
    };
  },
  computed: {
    currentColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  methods: {
    init() {
      const canvas = document.getElementById("canvas");
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: this.currentColor,
        backgroundAlpha: true,
      });
      canvas.appendChild(app.view);
      const trailTexture = PIXI.Texture.from(
        require("@/assets/images/trail.png")
      );
      const historyX = [];
      const historyY = [];
      const historySize = 20;
      const ropeSize = 100;
      const points = [];
      for (let i = 0; i < historySize; i++) {
        historyX.push(0);
        historyY.push(0);
      }
      for (let i = 0; i < ropeSize; i++) {
        points.push(new PIXI.Point(0, 0));
      }
      const rope = new PIXI.SimpleRope(trailTexture, points);
      rope.blendmode = PIXI.BLEND_MODES.ADD;

      app.stage.addChild(rope);

      // eslint-disable-next-line
      app.ticker.add((delta) => {
        // eslint-disable-next-line
        const touchposition = app.renderer.plugins.interaction.on(
          "touchmove",
          (event) => {
            this.x = event.data.global.x;
            this.y = event.data.global.y;
          }
        );
        historyX.pop();
        historyX.unshift(this.x);
        historyY.pop();
        historyY.unshift(this.y);
        for (let i = 0; i < ropeSize; i++) {
          const p = points[i];
          const ix = this.cubicInterpolation(
            historyX,
            (i / ropeSize) * historySize
          );
          const iy = this.cubicInterpolation(
            historyY,
            (i / ropeSize) * historySize
          );

          p.x = ix;
          p.y = iy;
        }
      });
    },
    clipInput(k, arr) {
      if (k < 0) k = 0;
      if (k > arr.length - 1) k = arr.length - 1;
      return arr[k];
    },

    getTangent(k, factor, array) {
      return (
        (factor *
          (this.clipInput(k + 1, array) - this.clipInput(k - 1, array))) /
        2
      );
    },

    cubicInterpolation(array, t, tangentFactor) {
      if (tangentFactor == null) tangentFactor = 1;

      const k = Math.floor(t);
      const m = [
        this.getTangent(k, tangentFactor, array),
        this.getTangent(k + 1, tangentFactor, array),
      ];
      const p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
      t -= k;
      const t2 = t * t;
      const t3 = t * t2;
      return (
        (2 * t3 - 3 * t2 + 1) * p[0] +
        (t3 - 2 * t2 + t) * m[0] +
        (-2 * t3 + 3 * t2) * p[1] +
        (t3 - t2) * m[1]
      );
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped></style>
