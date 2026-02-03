const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// OG image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Project data
const projects = {
  gemini: {
    name: 'gemini',
    desc: 'Cryptocurrency exchange engineering — KYC systems, compliance tools, event-driven architecture at scale.',
    icon: '◈'
  },
  propheseer: {
    name: 'propheseer',
    desc: 'Unified prediction market API aggregating Polymarket, Kalshi, and more into a single REST interface.',
    icon: '◉'
  },
  'propheseer-marketing': {
    name: 'propheseer marketing',
    desc: 'Self-improving Twitter engagement system with closed-loop analytics and automated strategy optimization.',
    icon: '↻'
  },
  jhipro: {
    name: 'jhi pro',
    desc: 'Real-time climbing gym occupancy tracker with historical trends and data visualization.',
    icon: '▲'
  },
  edmunds: {
    name: 'edmunds',
    desc: 'API platform development for automotive data — matching algorithms, scalable microservice architecture.',
    icon: '◯'
  },
  cryptosym: {
    name: 'cryptosym',
    desc: 'Cryptocurrency trading simulator for risk-free learning and practice with real-time market data.',
    icon: '₿'
  },
  'bcg-dappathon': {
    name: 'bcg dappathon',
    desc: 'Blockchain-based hotel payment system built during 48-hour BCG Digital Ventures hackathon.',
    icon: '⬡'
  }
};

function generateOGImage(projectKey) {
  const project = projects[projectKey];
  if (!project) {
    console.error(`Unknown project: ${projectKey}`);
    return;
  }

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0d0d0d');
  gradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle grid pattern
  ctx.strokeStyle = 'rgba(85, 170, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x <= WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);

  // Accent dot
  ctx.fillStyle = '#55aaff';
  ctx.beginPath();
  ctx.arc(WIDTH - 60, 60, 8, 0, Math.PI * 2);
  ctx.fill();

  // Project name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 84px monospace';
  ctx.fillText(project.name, 120, 260);

  // Description - wrap text
  ctx.fillStyle = '#999999';
  ctx.font = '36px sans-serif';
  const maxWidth = 960;
  const words = project.desc.split(' ');
  let line = '';
  let y = 340;
  const lineHeight = 50;

  for (let word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), 120, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 120, y);

  // Domain
  ctx.fillStyle = '#555555';
  ctx.font = '28px monospace';
  ctx.fillText('jeremyhi.com', 120, HEIGHT - 60);

  // Icon hint (faint, large)
  ctx.fillStyle = 'rgba(85, 170, 255, 0.08)';
  ctx.font = '160px sans-serif';
  ctx.fillText(project.icon, WIDTH - 250, HEIGHT - 100);

  return canvas;
}

// Generate specified project or all
const targetProject = process.argv[2];
const outputDir = path.join(__dirname, '..', 'assets', 'og');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (targetProject) {
  // Generate single project
  const canvas = generateOGImage(targetProject);
  if (canvas) {
    const outputPath = path.join(outputDir, `${targetProject}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Generated: ${outputPath}`);
    console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  }
} else {
  // Generate all
  for (const key of Object.keys(projects)) {
    const canvas = generateOGImage(key);
    if (canvas) {
      const outputPath = path.join(outputDir, `${key}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Generated: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }
}
