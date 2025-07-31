<template>
  <div id="userLayout">
    <canvas ref="canvas" class="star-canvas"></canvas>
    <a-layout>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let animationId: number;

const initCanvas = () => {
  if (!canvas.value) return;
  
  try {
    const ctx = canvas.value.getContext("2d");
    if (!ctx) {
      console.warn('Canvas context not available');
      return;
    }
  } catch (error) {
    console.warn('Failed to get canvas context:', error);
    return;
  }
  
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  const w = (canvas.value.width = window.innerWidth);
  const h = (canvas.value.height = window.innerHeight);

  const stars = Array.from({ length: 500 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02,
  }));

  const meteors: any[] = [];

  const createMeteor = () => {
    meteors.push({
      x: Math.random() * w,
      y: (Math.random() * h) / 2,
      length: Math.random() * 300 + 100,
      speed: Math.random() * 10 + 6,
      angle: Math.PI / 4,
      alpha: 1,
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      ctx.beginPath();
      ctx.globalAlpha = s.alpha;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta = -s.delta;
    }

    for (let i = 0; i < meteors.length; i++) {
      const m = meteors[i];
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(
        m.x - m.length * Math.cos(m.angle),
        m.y - m.length * Math.sin(m.angle)
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(255,255,255,${m.alpha})`;
      ctx.stroke();
      m.x += m.speed * Math.cos(m.angle);
      m.y += m.speed * Math.sin(m.angle);
      m.alpha -= 0.01;
      if (m.alpha <= 0) meteors.splice(i, 1);
    }

    if (Math.random() < 0.02) createMeteor();

    animationId = requestAnimationFrame(draw);
  };

  draw();
};

onMounted(() => {
  initCanvas();
  window.addEventListener("resize", initCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", initCanvas);
  cancelAnimationFrame(animationId);
});
</script>

<style scoped>
#userLayout {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.star-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  background: black;
}

a-layout {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
}

a-layout-content.content {
  flex: 1;
  padding: 24px;
  background: transparent;
  overflow: auto;
}
</style>
