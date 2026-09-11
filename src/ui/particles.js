// Capa decorativa independiente. No conoce reservas, formularios ni validación.
export function iniciarParticulas(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return () => {};

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = { x: -1000, y: -1000, destinoX: -1000, destinoY: -1000, intensidad: 0, activo: false };
  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;

  // Una cantidad contenida mantiene la profundidad sin convertirla en ruido visual.
  const puntos = Array.from({ length: 48 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - .5) * .000008,
    vy: (Math.random() - .5) * .000008,
    ox: 0,
    oy: 0,
    radio: .8 + Math.random() * 1.25,
  }));

  function dibujar(delta = 0) {
    ctx.clearRect(0, 0, width, height);
    const reducido = motion.matches;
    const cantidad = reducido ? 28 : puntos.length;
    const posiciones = [];
    const escalaTiempo = Math.min(delta, 60);

    if (!reducido) {
      cursor.x += (cursor.destinoX - cursor.x) * .14;
      cursor.y += (cursor.destinoY - cursor.y) * .14;
      cursor.intensidad += ((cursor.activo ? 1 : 0) - cursor.intensidad) * .09;
    }

    for (let indice = 0; indice < cantidad; indice += 1) {
      const p = puntos[indice];
      if (!reducido) {
        p.x = (p.x + p.vx * escalaTiempo + 1) % 1;
        p.y = (p.y + p.vy * escalaTiempo + 1) % 1;
      }

      const baseX = p.x * width;
      const baseY = p.y * height;
      const dx = baseX - cursor.x;
      const dy = baseY - cursor.y;
      const distancia2 = dx * dx + dy * dy;
      let destinoOx = 0;
      let destinoOy = 0;

      if (!reducido && cursor.intensidad > .01 && distancia2 > 0 && distancia2 < 190 * 190) {
        const distancia = Math.sqrt(distancia2);
        const fuerza = (1 - distancia / 190) ** 2 * 18 * cursor.intensidad;
        destinoOx = dx / distancia * fuerza;
        destinoOy = dy / distancia * fuerza;
      }

      // El resorte visual suaviza tanto la llegada como la desaparición de la reacción.
      p.ox += (destinoOx - p.ox) * .1;
      p.oy += (destinoOy - p.oy) * .1;
      posiciones.push({ x: baseX + p.ox, y: baseY + p.oy, radio: p.radio });
    }

    // Conexiones ambientales entre partículas cercanas; sin líneas directas al cursor.
    const limite2 = 118 * 118;
    ctx.lineWidth = .55;
    for (let a = 0; a < posiciones.length; a += 1) {
      for (let b = a + 1; b < posiciones.length; b += 1) {
        const dx = posiciones[a].x - posiciones[b].x;
        const dy = posiciones[a].y - posiciones[b].y;
        const distancia2 = dx * dx + dy * dy;
        if (distancia2 > limite2) continue;
        const opacidad = (1 - distancia2 / limite2) * (reducido ? .07 : .14);
        ctx.strokeStyle = `rgba(151, 177, 255, ${opacidad})`;
        ctx.beginPath();
        ctx.moveTo(posiciones[a].x, posiciones[a].y);
        ctx.lineTo(posiciones[b].x, posiciones[b].y);
        ctx.stroke();
      }
    }

    for (const p of posiciones) {
      ctx.fillStyle = 'rgba(194, 211, 255, .68)';
      ctx.shadowColor = '#8f8dff';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function tick(time) {
    if (time - last >= 1000 / 30) {
      dibujar(last ? time - last : 0);
      last = time;
    }
    frame = requestAnimationFrame(tick);
  }

  function reanudar() {
    cancelAnimationFrame(frame);
    last = 0;
    if (document.hidden) return;
    dibujar();
    if (!motion.matches) frame = requestAnimationFrame(tick);
  }

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    reanudar();
  }

  const mover = event => {
    cursor.destinoX = event.clientX;
    cursor.destinoY = event.clientY;
    if (!cursor.activo) {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
    }
    cursor.activo = true;
  };
  const salir = () => { cursor.activo = false; };

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
