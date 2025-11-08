import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

const MAX_PARTICLES = 2400;
const RESOLUTION = 18;
const NOISE_SCALE = 0.018;
const BASE_SPEED = 0.5;

const FlowFieldCanvas = ({ accentRgb, isLuminous }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const settingsRef = useRef({ accentRgb, isLuminous });
  const noiseRef = useRef(createNoise2D());

  useEffect(() => {
    settingsRef.current = { accentRgb, isLuminous };
  }, [accentRgb, isLuminous]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    const particles = particlesRef.current;
    const noise2D = noiseRef.current;

    let width = 0;
    let height = 0;
    let time = Math.random() * 1000;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const resetParticle = (particle, origin = mouseRef.current) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80;
      particle.x = origin.x + Math.cos(angle) * radius;
      particle.y = origin.y + Math.sin(angle) * radius;
      particle.opacity = Math.random() * 0.4 + 0.25;
      particle.fade = Math.random() * 0.006 + 0.0025;
      particle.speed = (Math.random() * 0.6 + 0.4) * BASE_SPEED;
    };

    const createParticle = () => {
      const particle = { x: 0, y: 0, opacity: 1, fade: 0.005, speed: BASE_SPEED };
      resetParticle(particle, mouseRef.current);
      return particle;
    };

    const addParticles = () => {
      while (particles.length < MAX_PARTICLES) {
        particles.push(createParticle());
      }
    };

    const evolve = () => {
      const { accentRgb: currentAccent, isLuminous: glowActive } = settingsRef.current;
      const accentArray = Array.isArray(currentAccent)
        ? currentAccent
        : typeof currentAccent === "string"
        ? currentAccent.trim().split(/[ ,]+/).map(Number)
        : [160, 186, 255];
      const accentColor = `${accentArray[0]}, ${accentArray[1]}, ${accentArray[2]}`;
      const fadeStrength = glowActive ? 0.08 : 0.14;
      const particleBoost = glowActive ? 1.2 : 0.8;

      animationRef.current = window.requestAnimationFrame(evolve);
      time += 0.003;

      ctx.fillStyle = `rgba(6, 7, 12, ${fadeStrength})`;
      ctx.fillRect(0, 0, width, height);

      addParticles();

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.opacity -= p.fade;

        const angle =
          noise2D(p.x * NOISE_SCALE, p.y * NOISE_SCALE + time) * Math.PI * 2 +
          noise2D((p.x + time) * NOISE_SCALE, (p.y - time) * NOISE_SCALE) * 0.4;

        p.x += Math.cos(angle) * p.speed * particleBoost;
        p.y += Math.sin(angle) * p.speed * particleBoost;

        const outOfBounds = p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50;

        if (p.opacity <= 0 || outOfBounds || Number.isNaN(p.x) || Number.isNaN(p.y)) {
          resetParticle(p);
          continue;
        }

        const intensity = glowActive ? 0.4 : 0.18;
        const alpha = Math.min(intensity + p.opacity * 0.6, 0.85);
        ctx.fillStyle = `rgba(${accentColor}, ${alpha})`;
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
      }
    };

    const handlePointerMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: width / 2, y: height / 2 };
    };

    resize();
    addParticles();
    evolve();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      particles.length = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="flow-field" aria-hidden="true" />;
};

export default FlowFieldCanvas;

