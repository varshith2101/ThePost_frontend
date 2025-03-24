// components/Hero.js
import React, { useRef, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particlesArray = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesArray.current = [];
      const particleCount = canvas.width * canvas.height / 500;
      
      for (let i = 0; i < particleCount; i++) {
        particlesArray.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          baseColor: [240, 103, 57] // Orange color in RGB
        });
      }
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesArray.current.forEach((p) => {
        // Calculate distance to mouse
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        // Mouse interaction
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          // Push particles away from mouse
          p.x -= Math.cos(angle) * force * 16;
          p.y -= Math.sin(angle) * force * 16;
          
          // Brighter when near mouse
          const alpha = Math.min(0.8, 0.2 + force * 0.6);
          ctx.fillStyle = `rgba(${p.baseColor.join(',')}, ${alpha})`;
        } else {
          // Normal movement
          p.x += p.speedX;
          p.y += p.speedY;
          ctx.fillStyle = `rgba(${p.baseColor.join(',')}, 0.2)`;
        }
        
        // Wrap around edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        // Draw particle with glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${p.baseColor.join(',')}, 0.5)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw mouse attraction area (subtle effect)
      if (mouse.current.x > 0 && mouse.current.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 150
        );
        gradient.addColorStop(0, 'rgba(240, 103, 57, 0.05)');
        gradient.addColorStop(1, 'rgba(240, 103, 57, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    // Setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="hero">
      <canvas 
        ref={canvasRef} 
        className="particle-canvas"
      />
      <h1 className="hero-title">Welcome to The Post</h1>
    </section>
  );
};

export default Hero;