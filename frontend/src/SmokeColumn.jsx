import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 260;
const CURVES = 4;
const STEPS = 28;
const SPEED = 0.55;

const SmokeColumn = ({ accentRgb = [150, 180, 255], isLuminous }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let pathController;

    const accentArray = Array.isArray(accentRgb)
      ? accentRgb
      : typeof accentRgb === "string"
      ? accentRgb.trim().split(/[ ,]+/).map(Number)
      : [150, 180, 255];
    const baseColor = `${accentArray[0]}, ${accentArray[1]}, ${accentArray[2]}`;

    const resize = () => {
      width = CANVAS_WIDTH;
      height = window.innerHeight;
      canvas.style.width = `${CANVAS_WIDTH}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const interpolatePoints = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

    class Curve {
      constructor(config = {}) {
        const MAX_WIDTH = width;
        const MIN_WIDTH = width * 0.2;
        const MAX_LENGTH = height * 0.3;
        const MIN_LENGTH = height * 0.18;

        this.startPoint = config.startPoint || [randomInRange(0, MAX_WIDTH), 0];
        this.length = randomInRange(MIN_LENGTH, MAX_LENGTH);
        this.startWhiskerLength = config.startWhiskerLength || this.length * 0.3;
        this.endWhiskerLength = this.length * 0.3;

        const startX = this.startPoint[0];
        let endX;
        if (startX > MAX_WIDTH / 2) {
          endX = randomInRange(MIN_WIDTH * 0.12, MIN_WIDTH);
        } else {
          endX = randomInRange(MAX_WIDTH - MIN_WIDTH, MAX_WIDTH - MIN_WIDTH * 0.12);
        }

        this.endPoint = [endX, this.startPoint[1] + this.length];
        this.forcedBezier = config.forcedBezier;
      }

      toBezier() {
        return (
          this.forcedBezier || {
            startPoint: this.startPoint,
            endPoint: this.endPoint,
            cp1: [this.startPoint[0], this.startPoint[1] + this.startWhiskerLength],
            cp2: [this.endPoint[0], this.endPoint[1] - this.endWhiskerLength],
          }
        );
      }

      draw(opacityScale) {
        const bez = this.toBezier();
        const gradient = ctx.createLinearGradient(0, bez.startPoint[1], width, bez.endPoint[1]);
        gradient.addColorStop(0, `rgba(${baseColor}, ${0})`);
        gradient.addColorStop(0.4, `rgba(${baseColor}, ${0.12 * opacityScale})`);
        gradient.addColorStop(0.65, `rgba(${baseColor}, ${0.22 * opacityScale})`);
        gradient.addColorStop(1, `rgba(${baseColor}, ${0})`);

        ctx.beginPath();
        ctx.moveTo(...bez.startPoint);
        ctx.bezierCurveTo(...bez.cp1, ...bez.cp2, ...bez.endPoint);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.75;
        ctx.globalCompositeOperation = "lighter";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }

      step() {
        const bez = this.toBezier();
        const offset = SPEED * (isLuminous ? 1.12 : 0.85);
        this.forcedBezier = {
          startPoint: [bez.startPoint[0], bez.startPoint[1] - offset],
          endPoint: [bez.endPoint[0], bez.endPoint[1] - offset],
          cp1: [bez.cp1[0], bez.cp1[1] - offset],
          cp2: [bez.cp2[0], bez.cp2[1] - offset],
        };
      }

      interpolateWith(curve, count = STEPS) {
        const interpolated = [];
        const bezA = this.toBezier();
        const bezB = curve.toBezier();
        for (let i = 1; i <= count; i += 1) {
          const progress = i / (count + 1);
          const forcedBezier = {
            startPoint: interpolatePoints(bezA.startPoint, bezB.startPoint, progress),
            endPoint: interpolatePoints(bezA.endPoint, bezB.endPoint, progress),
            cp1: interpolatePoints(bezA.cp1, bezB.cp1, progress),
            cp2: interpolatePoints(bezA.cp2, bezB.cp2, progress),
          };
          interpolated.push(new Curve({ forcedBezier }));
        }
        return interpolated;
      }
    }

    class Path {
      constructor() {
        this.curves = [];
        this.interpolatedCurves = [];
      }

      extend() {
        const parentCurve = this.curves[this.curves.length - 1];
        const newCurve = new Curve(parentCurve ? { startPoint: [...parentCurve.endPoint] } : undefined);
        this.curves.push(newCurve);
        return newCurve;
      }

      draw(opacity) {
        this.curves.forEach((curve) => curve.draw(opacity));
        this.interpolatedCurves.forEach((set) => set.forEach((curve) => curve.draw(opacity * 0.45)));
      }

      step() {
        this.curves.forEach((curve) => curve.step());
        this.interpolatedCurves.forEach((set) => set.forEach((curve) => curve.step()));
      }

      getBottom() {
        if (!this.curves.length) return 0;
        return this.curves[this.curves.length - 1].endPoint[1];
      }

      shift() {
        this.curves.shift();
      }

      interpolateWith(path) {
        this.interpolatedCurves = this.curves.map((curve, idx) => {
          if (!path.curves[idx]) path.extend();
          return curve.interpolateWith(path.curves[idx]);
        });
      }
    }

    class PathController {
      constructor(count) {
        this.paths = Array.from({ length: count }, () => new Path());
        this.minFill = height + 512;
      }

      extendPaths() {
        this.paths.forEach((path) => path.extend());
      }

      ensureFilled() {
        this.paths.forEach((path) => {
          while (path.getBottom() < this.minFill) {
            this.extendPaths();
          }
        });

        this.paths.forEach((path) => {
          if (path.curves.length && path.curves[0].endPoint[1] < -256) {
            path.shift();
          }
        });

        this.interpolate();
      }

      interpolate() {
        this.paths.forEach((path, idx) => {
          if (this.paths[idx + 1]) {
            path.interpolateWith(this.paths[idx + 1]);
          }
        });
      }

      step() {
        this.paths.forEach((path) => path.step());
      }

      draw(opacity) {
        this.paths.forEach((path) => path.draw(opacity));
      }
    }

    const clearCanvas = () => {
      const fade = isLuminous ? 0.04 : 0.08;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(7, 8, 16, ${fade})`;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      clearCanvas();
      pathController.step();
      pathController.ensureFilled();
      const opacity = isLuminous ? 1.35 : 0.95;
      pathController.draw(opacity);
      animationRef.current = window.requestAnimationFrame(animate);
    };

    const init = () => {
      window.cancelAnimationFrame(animationRef.current);
      resize();
      ctx.clearRect(0, 0, width, height);
      pathController = new PathController(CURVES);
      pathController.ensureFilled();
      animate();
    };

    init();

    const handleResize = () => init();

    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [accentRgb, isLuminous]);

  return (
    <div className={`smoke-overlay ${isLuminous ? "smoke-overlay--lit" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SmokeColumn;

