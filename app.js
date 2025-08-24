(() => {
  const waveCanvas = document.getElementById('waveCanvas');
  const particleCanvas = document.getElementById('particleCanvas');
  const waveCtx = waveCanvas.getContext('2d');
  const particleCtx = particleCanvas.getContext('2d');

  let quantumState = {
    inSuperposition: true,
    measured: false,
    entangled: false,
    observerPresent: false,
    waveCollapsed: false,
    tunneling: false,
    uncertainty: 50,
    frequency: 1.0,
    waveType: 'sine',
    interferenceActive: false,
    measurementResult: null,
    probabilityA: 50,
    probabilityB: 50,
    particles: []
  };

  for (let i = 0; i < 20; i++) {
    quantumState.particles.push({
      x: Math.random() * 400,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random()
    });
  }

  let animationTime = 0;
  function animate() {
    animationTime += 0.05;
    drawWaveFunction();
    drawParticles();
    requestAnimationFrame(animate);
  }

  function drawWaveFunction() {
    waveCtx.clearRect(0, 0, 400, 300);
    if (quantumState.waveCollapsed) {
      waveCtx.strokeStyle = quantumState.measurementResult === 'A' ? '#ff0080' : '#00ffff';
      waveCtx.lineWidth = 3;
      waveCtx.beginPath();
      const centerY = 150;
      const centerX = quantumState.measurementResult === 'A' ? 100 : 300;
      for (let x = 0; x < 400; x++) {
        const distance = Math.abs(x - centerX);
        const amplitude = 50 * Math.exp(-distance / 30);
        const y = centerY + amplitude * Math.sin((x - centerX) * 0.1 + animationTime);
        x === 0 ? waveCtx.moveTo(x, y) : waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();
    } else if (quantumState.inSuperposition) {
      waveCtx.strokeStyle = `rgba(0,255,255,${quantumState.observerPresent ? 0.3 : 0.8})`;
      waveCtx.lineWidth = 2;
      waveCtx.beginPath();
      for (let x = 0; x < 400; x++) {
        let y = 150;
        y += quantumState.waveType === 'sine'
          ? 30 * Math.sin(x * 0.02 * quantumState.frequency + animationTime)
          : 30 * Math.cos(x * 0.02 * quantumState.frequency + animationTime);
        if (quantumState.interferenceActive) {
          y += 15 * Math.sin(x * 0.04 * quantumState.frequency + animationTime * 1.5);
        }
        x === 0 ? waveCtx.moveTo(x, y) : waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();
      waveCtx.fillStyle = 'rgba(255,0,128,0.3)';
      waveCtx.fillRect(50, 100, 100, 100);
      waveCtx.fillStyle = 'rgba(0,255,255,0.3)';
      waveCtx.fillRect(250, 100, 100, 100);
    }
    if (quantumState.tunneling) {
      waveCtx.fillStyle = 'rgba(255,255,0,0.5)';
      waveCtx.fillRect(180, 50, 40, 200);
    }
  }

  function drawParticles() {
    particleCtx.clearRect(0, 0, 400, 300);
    quantumState.particles.forEach((p, i) => {
      if (quantumState.waveCollapsed && quantumState.measurementResult) {
        const tx = quantumState.measurementResult === 'A' ? 100 : 300;
        p.x += (tx - p.x) * 0.1;
        p.y += (150 - p.y) * 0.1;
      } else if (quantumState.inSuperposition) {
        p.x += p.vx * (quantumState.observerPresent ? 0.5 : 1);
        p.y += p.vy * (quantumState.observerPresent ? 0.5 : 1);
        p.phase += 0.1;
        if (p.x < 0 || p.x > 400) p.vx *= -1;
        if (p.y < 0 || p.y > 300) p.vy *= -1;
        p.x = Math.max(0, Math.min(400, p.x));
        p.y = Math.max(0, Math.min(300, p.y));
      }
      const alpha = quantumState.inSuperposition
        ? (0.3 + 0.4 * Math.sin(p.phase)) * (quantumState.observerPresent ? 0.5 : 1)
        : 0.8;
      particleCtx.fillStyle = quantumState.entangled
        ? `rgba(255,0,255,${alpha})`
        : `rgba(0,255,255,${alpha})`;
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      particleCtx.fill();
      if (quantumState.entangled && i < quantumState.particles.length - 1) {
        const n = quantumState.particles[i + 1];
        particleCtx.strokeStyle = 'rgba(255,0,255,0.3)';
        particleCtx.lineWidth = 1;
        particleCtx.beginPath();
        particleCtx.moveTo(p.x, p.y);
        particleCtx.lineTo(n.x, n.y);
        particleCtx.stroke();
      }
    });
  }

  function updateUI() {
    document.getElementById('currentState').textContent = quantumState.inSuperposition ? 'Superposition' : 'Collapsed';
    document.getElementById('measurementStatus').textContent = quantumState.measured ? 'Yes' : 'No';
    document.getElementById('entanglementStatus').textContent = quantumState.entangled ? 'Yes' : 'No';
    document.getElementById('observerStatus').textContent = quantumState.observerPresent ? 'Yes' : 'No';
    document.getElementById('collapseStatus').textContent = quantumState.waveCollapsed ? 'Yes' : 'No';
    document.getElementById('tunnelingStatus').textContent = quantumState.tunneling ? 'Yes' : 'No';
    document.getElementById('probA').style.width = quantumState.probabilityA + '%';
    document.getElementById('probB').style.width = quantumState.probabilityB + '%';
  }

  function createSuperposition() {
    quantumState.inSuperposition = true;
    quantumState.measured = false;
    quantumState.waveCollapsed = false;
    quantumState.measurementResult = null;
    quantumState.probabilityA = 50;
    quantumState.probabilityB = 50;
    document.getElementById('measurementResult').textContent =
      'System in quantum superposition — all possibilities exist simultaneously.';
    updateUI();
  }

  function measureSystem() {
    if (!quantumState.inSuperposition) return;
    quantumState.measured = true;
    quantumState.waveCollapsed = true;
    quantumState.inSuperposition = false;
    quantumState.measurementResult = Math.random() < (quantumState.probabilityA / 100) ? 'A' : 'B';
    quantumState.probabilityA = quantumState.measurementResult === 'A' ? 100 : 0;
    quantumState.probabilityB = 100 - quantumState.probabilityA;
    document.getElementById('measurementResult').textContent =
      `Wave function collapsed! Particle measured at position ${quantumState.measurementResult}`;
    updateUI();
  }

  function resetSystem() {
    quantumState = { ...quantumState,
      inSuperposition: true, measured: false, entangled: false,
      observerPresent: false, waveCollapsed: false, tunneling: false,
      uncertainty: 50, frequency: 1.0, waveType: 'sine',
      interferenceActive: false, measurementResult: null,
      probabilityA: 50, probabilityB: 50
    };
    document.getElementById('measurementResult').textContent = 'System reset to quantum superposition';
    updateUI();
  }

  function updateUncertainty(val) {
    quantumState.uncertainty = val;
    document.getElementById('uncertaintyValue').textContent = `${val}%`;
    const deviation = (val / 100) * 50;
    quantumState.probabilityA = Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * deviation));
    quantumState.probabilityB = 100 - quantumState.probabilityA;
    updateUI();
  }

  function updateFrequency(val) {
    quantumState.frequency = parseFloat(val);
    document.getElementById('frequencyValue').textContent = quantumState.frequency.toFixed(1);
  }

  document.getElement
