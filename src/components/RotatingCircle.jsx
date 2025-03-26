import React, { useEffect, useRef } from 'react';
import './Spirograph.css';

const RotatingCircle = () => {
  const canvasRef = useRef(null);
  const circles = 12; // Number of circles
  const radiusStep = 30; // Distance between circles
  const minRadius = 20; // Smallest circle radius
  const rotationSpeed = 0.005; // Rotation speed (higher = faster)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.5;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < circles; i++) {
        const radius = minRadius + i * radiusStep * 4;
        const x = centerX + Math.cos(angle + i * Math.PI / circles * 2) * radius * 0.3;
        const y = centerY + Math.sin(angle + i * Math.PI / circles * 2) * radius * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      angle += rotationSpeed;
      animationId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="spirograph-canvas" />;
};

export default RotatingCircle;