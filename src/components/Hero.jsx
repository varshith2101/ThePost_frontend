// components/Hero.js
import React, { useRef, useEffect, useCallback } from 'react';
import './Hero.css';

const Hero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null); // New ref for the hero section
  const mouse = useRef({ x: -1000, y: -1000 });
  const particlesArray = useRef([]);
  const animationId = useRef(null);
  const canvasSize = useRef({ width: 0, height: 0 });

  const SHAPES = ['circle', 'square', 'triangle'];
  const COLORS = [
    [240, 103, 57], [56, 182, 255], [255, 215, 0], 
    [138, 43, 226], [50, 205, 50]
  ];

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    particlesArray.current = [];
    const particleCount = Math.floor(canvas.offsetWidth * canvas.offsetHeight / 800);
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4 + 2;
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      particlesArray.current.push({
        x: Math.random() * canvasSize.current.width,
        y: Math.random() * canvasSize.current.height,
        size,
        speedX: Math.random() * 2 ,
        speedY: Math.random() * 2 ,
        baseColor: color,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }, []);

  const drawShape = (ctx, particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    
    switch(particle.shape) {
      case 'square':
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size/1.5);
        ctx.lineTo(-particle.size/2, particle.size/1.5);
        ctx.lineTo(particle.size/2, particle.size/1.5);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(0, 0, particle.size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const heroSection = heroRef.current; // Get the hero section element

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      canvasSize.current = { width: canvas.width, height: canvas.height };
      initParticles();
    };

    // Changed to track mouse on hero section instead of canvas
    const handleMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      if (!canvasRef.current) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX *= -1;
          p.x = Math.max(0, Math.min(p.x, canvas.width));
        }
        if (p.y < 0 || p.y > canvas.height) {
          p.speedY *= -1;
          p.y = Math.max(0, Math.min(p.y, canvas.height));
        }
        
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;
        
        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const forceMultiplier = p.shape === 'circle' ? 6 : 
                               p.shape === 'square' ? 8 : 10;
          p.x -= Math.cos(angle) * force * forceMultiplier;
          p.y -= Math.sin(angle) * force * forceMultiplier;
        }
        
        const alpha = distance < maxDistance ? 
          1 : 1 - Math.min((distance - maxDistance) / 100, 0.8);
        
        ctx.fillStyle = `rgba(${p.baseColor.join(',')}, ${alpha})`;
        ctx.shadowBlur = p.shape === 'circle' ? 15 : 10;
        ctx.shadowColor = `rgba(${p.baseColor.join(',')}, ${alpha * 0.7})`;
        
        drawShape(ctx, p);
      });

      // Change this gradient in your animate() function
      if (mouse.current.x > 0 && mouse.current.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 150
        );
        // Change from orange to white while maintaining opacity
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');  // White with same alpha
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');     // White with same alpha
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Attach events to hero section instead of canvas
    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);
    
    animationId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId.current);
    };
  }, [initParticles]);

  return (
  <section className="hero" ref={heroRef}>
    <canvas 
      ref={canvasRef} 
      className="particle-canvas"
    />
    <div className="hero-content">
      <h1 className="hero-title">Welcome to The MIT Post</h1>
      <p className="hero-subtitle">The official student media of MIT</p>
    </div>
  </section>
);
};

export default Hero;