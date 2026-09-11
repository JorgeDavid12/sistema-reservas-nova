// Capa decorativa independiente. No conoce reservas, formularios ni validación.
export function iniciarParticulas(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return () => {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: -1000, y: -1000 };
  let width = 0, height = 0, frame = 0, last = 0;
  const puntos = Array.from({ length: 52 }, () => ({
    x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .000012,
    vy: (Math.random() - .5) * .000012, radio: .9 + Math.random() * 1.2,
  }));
  function dibujar(delta = 0) {
    ctx.clearRect(0, 0, width, height);
    for (const p of puntos) {
      p.x = (p.x + p.vx * delta + 1) % 1;
      p.y = (p.y + p.vy * delta + 1) % 1;
      let x = p.x * width, y = p.y * height;
      const dx = x - pointer.x, dy = y - pointer.y;
      const distancia = Math.hypot(dx, dy);
      if (!motion.matches && distancia < 170 && distancia > 0) {
        const fuerza = (1 - distancia / 170) * 14;
        x += dx / distancia * fuerza;
        y += dy / distancia * fuerza;
        ctx.strokeStyle = `rgba(157, 179, 255, ${(1 - distancia / 170) * .3})`;
        ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
      }
      ctx.fillStyle = distancia < 170 ? 'rgba(205,231,255,.9)' : 'rgba(174,184,255,.65)';
      ctx.shadowColor = '#aaa1ff'; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(x, y, p.radio, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  function tick(time) {
    if (time - last >= 1000 / 30) {
      dibujar(last ? Math.min(time - last, 60) : 0);
      last = time;
    }
    frame = requestAnimationFrame(tick);
  }
  function reanudar() {
    cancelAnimationFrame(frame); last = 0;
    if (document.hidden) return;
    dibujar();
    if (!motion.matches) frame = requestAnimationFrame(tick);
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    reanudar();
  }
  const mover = event => { pointer.x = event.clientX; pointer.y = event.clientY; };
  const salir = () => { pointer.x = -1000; pointer.y = -1000; };
  window.addEventListener('pointermove', mover, { passive: true });
  document.addEventListener('pointerleave', salir);
  window.addEventListener('blur', salir);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', reanudar);
  motion.addEventListener('change', reanudar);
  resize();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', mover);
    document.removeEventListener('pointerleave', salir);
    window.removeEventListener('blur', salir);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', reanudar);
    motion.removeEventListener('change', reanudar);
    ctx.clearRect(0, 0, width, height);
  };
}
