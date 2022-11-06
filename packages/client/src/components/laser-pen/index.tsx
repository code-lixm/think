import { drainPoints, drawLaserPen, setRoundCap } from 'laser-pen';
import React, { useEffect, useRef } from 'react';

interface IPoint {
  x: number;
  y: number;
}

interface IOriginalPointData extends IPoint {
  time: number;
}

interface IProps {
  isDrawing: boolean;
}

const LaserPen: React.FC<IProps> = ({ isDrawing = false }) => {
  const $canvas = useRef<HTMLCanvasElement>();
  useEffect(() => {
    const mount = (isDestroy: boolean) => {
      if (!$canvas.current) return;
      setRoundCap(true);

      const element = $canvas.current;
      const ctx = element.getContext('2d');

      const ratio = ((context: any) => {
        const backingStore =
          context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio ||
          1;
        return (window.devicePixelRatio || 1) / backingStore;
      })(ctx);

      const width = window.innerWidth * ratio + 'px';
      const height = window.innerHeight * ratio + 'px';

      element.setAttribute('width', width);
      element.setAttribute('height', height);

      const elementRect = element.getBoundingClientRect();
      let drawing = false;
      let mouseTrack: IOriginalPointData[] = [];
      const draw = () => {
        let needDrawInNextFrame = false;
        ctx.clearRect(0, 0, elementRect.width, elementRect.height);
        mouseTrack = drainPoints(mouseTrack);
        if (mouseTrack.length >= 3) {
          drawLaserPen(ctx, mouseTrack);
          needDrawInNextFrame = true;
        }
        if (needDrawInNextFrame) {
          requestAnimationFrame(draw);
        } else {
          drawing = false;
        }
      };
      const startDraw = () => {
        if (!drawing) {
          drawing = true;
          draw();
        }
      };
      const onMousemove = (event: MouseEvent) => {
        const relativeX = event.clientX - elementRect.x;
        const relativeY = event.clientY - elementRect.y;
        mouseTrack.push({
          x: relativeX,
          y: relativeY,
          time: Date.now(),
        });
        startDraw();
      };
      if (isDestroy) {
        window.removeEventListener('mousemove', onMousemove);
      }
      window.addEventListener('mousemove', onMousemove);
    };
    if (isDrawing) {
      mount(false);
    }
    return () => mount(true);
  }, [isDrawing]);
  return isDrawing ? (
    <canvas
      ref={$canvas}
      className="absolute left-0 top-0 right-0 bottom-0 z-[10000] pointer-events-none bg-transparent"
    />
  ) : null;
};

export default LaserPen;
