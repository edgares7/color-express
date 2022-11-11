<template>
  <div class="canvas">
    <div class="portrait">
      <h1>Please Rotate your Phone</h1>
      <img src="@/assets/images/rotate.png" />
    </div>
    <canvas ref="canvas" id="canvas" class="landscape"></canvas>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
// eslint-disable-next-line
import * as particles from "pixi-particles";
import faker from "faker";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Canvas",
  data() {
    return {
      colors: [
        "0x8bd4df",
        "0x005289",
        "0xa37db8",
        "0xed77ae",
        "0xfba92c",
        "0xb7d87a",
        "0x702f72",
        "0x1575ba",
        "0xef3b47",
        "0xdb1e84",
      ],
      app: null,
      sharpness: null,
      minDelta: null,
      texture: null,
      pointer: null,
      emitterPos: null,
      container: null,
      emitter: null,
      screenOrientation: "",
    };
  },
  computed: {
    ...mapState(["currentUserId"]),
    currentColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    },
  },
  methods: {
    ...mapMutations(["SET_CURENT_USER_ID"]),
    init() {
      this.sharpness = 0.1;
      this.minDelta = 0.05;

      this.app = new PIXI.Application({
        autoResize: true,
        backgroundColor: this.currentColor,
        width: window.innerWidth - 10,
        height: window.innerHeight - 10,
        view: document.querySelector("#canvas"),
      });

      this.texture = this.createTexture(0, 8, this.app.renderer.resolution);
      this.pointer = new PIXI.Point(
        this.app.screen.width / 2,
        this.app.screen.height / 2
      );

      this.emitterPos = this.pointer.clone();

      this.container = new PIXI.ParticleContainer(5000, {
        scale: true,
        position: true,
        rotation: false,
        uvs: false,
        tint: true,
      });

      this.emitter = new particles.Emitter(this.container, [this.texture], {
        autoUpdate: true,
        destroyWhenComplete: true,
        alpha: {
          start: 0.8,
          end: 0.15,
        },
        scale: {
          start: 1.7,
          end: 1,
          minimumScaleMultiplier: 1,
        },
        color: {
          start: "#ffffff",
          end: "#A9FCF4",
        },
        speed: {
          start: 0,
          end: 0,
          minimumSpeedMultiplier: 10,
        },
        acceleration: {
          x: 0,
          y: 0,
        },
        maxSpeed: 0,
        startRotation: {
          min: 0,
          max: 0,
        },
        noRotation: true,
        rotationSpeed: {
          min: 0,
          max: 0,
        },
        lifetime: {
          min: 0.6,
          max: 0.6,
        },
        blendMode: "normal",
        frequency: 0.0008,
        emitterLifetime: 0,
        maxParticles: 5000,
        pos: {
          x: 0,
          y: 0,
        },
        addAtBack: false,
        spawnType: "polygonalChain",
      });

      this.emitter.updateOwnerPos(this.emitterPos.x, this.emitterPos.y);

      this.app.stage.interactive = true;
      this.app.ticker.add(this.onTick);
      this.app.stage.on(
        "touchmove",
        (event) => (
          this.app.stage.addChild(this.container),
          this.pointer.copyFrom(event.data.global),
          this.emmitSocket(
            Math.floor(event.data.global.x),
            Math.floor(event.data.global.y)
          )
        )
      );
      window.addEventListener(
        "touchend",
        () => (
          this.app.stage.removeChild(this.container),
          this.$socket.sendObj({ msg: "touchend", payload: this.currentUserId })
        )
      );
    },
    onTick(delta) {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);

      if (!this.emitterPos.equals(this.pointer)) {
        const dt = 1 - Math.pow(1 - this.sharpness, delta);
        const dx = this.pointer.x - this.emitterPos.x;
        const dy = this.pointer.y - this.emitterPos.y;

        if (Math.abs(dx) > this.minDelta) {
          this.emitterPos.x += dx * dt;
        } else {
          this.emitterPos.x = this.pointer.x;
        }

        if (Math.abs(dy) > this.minDelta) {
          this.emitterPos.y += dy * dt;
        } else {
          this.emitterPos.y = this.pointer.y;
        }

        this.emitter.updateOwnerPos(this.emitterPos.x, this.emitterPos.y);
      }
    },
    createTexture(r1, r2, resolution) {
      const c = (r2 + 1) * resolution;
      r1 *= resolution;
      r2 *= resolution;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = canvas.height = c * 2;

      const gradient = context.createRadialGradient(c, c, r1, c, c, r2);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      return PIXI.Texture.from(canvas);
    },
    generateUserId() {
      let userId = faker.datatype.number(10);
      console.log(userId);
      this.SET_CURENT_USER_ID(userId);
    },
    emmitSocket(x, y) {
      let userObject = {
        id: this.currentUserId,
        x,
        y,
      };
      console.log("message: ", userObject);
      this.$socket.sendObj({ msg: "touch", payload: userObject });
    },
  },

  mounted() {
    this.init();
    this.generateUserId();
  },
};
</script>

<style lang="scss">
@media (orientation: landscape) {
  .landscape {
    display: flex !important;
  }
}
@media (orientation: portrait) {
  .portrait {
    display: flex !important;
  }
}
.canvas {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.portrait {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 300px;
  img {
    width: 50%;
  }
}
.landscape {
  display: none;
}
</style>
