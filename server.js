/**
 * NOVA SM — local admin API + static file server
 * Source of truth: data/projects.json
 * Also regenerates js/projects-data.js for the static site
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, 'img');
const DATA_DIR = path.join(ROOT, 'data');
const JSON_FILE = path.join(DATA_DIR, 'projects.json');
const JS_FILE = path.join(ROOT, 'js', 'projects-data.js');
const PORT = Number(process.env.PORT) || 5500;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const app = express();
app.use(express.json({ limit: '8mb' }));

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) return next();
  const token = req.headers['x-admin-token'] || req.query.token || '';
  if (token === ADMIN_PASSWORD) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

function buildProjectsFile(projects) {
  const body = projects
    .map((p) => '  ' + JSON.stringify(p, null, 2).replace(/\n/g, '\n  '))
    .join(',\n');

  return [
    '/* 포트폴리오 프로젝트 데이터 — portfolio.js · view.js 공유 */',
    'window.NOVASM_PROJECTS = [',
    body,
    '];',
    '',
    '/* Admin 원본 백업 + localStorage 오버라이드 (오프라인 미리보기용) */',
    'window.NOVASM_PROJECTS_BASE = window.NOVASM_PROJECTS;',
    '(function applyProjectsOverride() {',
    '  try {',
    "    const raw = localStorage.getItem('NOVASM_PROJECTS_OVERRIDE');",
    '    if (!raw) return;',
    '    const parsed = JSON.parse(raw);',
    '    if (Array.isArray(parsed)) window.NOVASM_PROJECTS = parsed;',
    "  } catch (_) { /* ignore corrupt override */ }",
    '})();',
    '',
  ].join('\n');
}

function readProjects() {
  if (!fs.existsSync(JSON_FILE)) {
    throw new Error('data/projects.json 이 없습니다');
  }
  const parsed = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('projects.json 형식이 올바르지 않습니다');
  return parsed;
}

function writeProjects(projects) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(JSON_FILE, JSON.stringify(projects, null, 2) + '\n', 'utf8');
  fs.writeFileSync(JS_FILE, buildProjectsFile(projects), 'utf8');
}

function safeMediaName(name) {
  const base = path.basename(String(name || 'file'));
  const cleaned = base.replace(/[^\w.\-가-힣]/g, '_');
  if (!cleaned || cleaned === '.' || cleaned === '..') return `file-${Date.now()}`;
  return cleaned;
}

function uniqueImgPath(filename) {
  let name = safeMediaName(filename);
  let full = path.join(IMG_DIR, name);
  if (!fs.existsSync(full)) return { name, full };

  const ext = path.extname(name);
  const stem = path.basename(name, ext);
  let n = 2;
  while (fs.existsSync(full)) {
    name = `${stem}-${n}${ext}`;
    full = path.join(IMG_DIR, name);
    n += 1;
  }
  return { name, full };
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif']);
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov']);

function mediaTypeFromName(name) {
  const ext = path.extname(name).toLowerCase();
  if (VIDEO_EXT.has(ext)) return 'video';
  if (IMAGE_EXT.has(ext)) return 'image';
  return 'other';
}

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, IMG_DIR),
    filename: (_req, file, cb) => {
      const { name } = uniqueImgPath(file.originalname);
      cb(null, name);
    },
  }),
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const type = mediaTypeFromName(file.originalname);
    if (type === 'other' && !file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      return cb(new Error('이미지 또는 영상 파일만 업로드할 수 있습니다'));
    }
    cb(null, true);
  },
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, authRequired: Boolean(ADMIN_PASSWORD) });
});

app.get('/api/projects', (_req, res) => {
  try {
    res.json({ ok: true, projects: readProjects() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.put('/api/projects', requireAdmin, (req, res) => {
  try {
    const projects = req.body?.projects;
    if (!Array.isArray(projects)) {
      return res.status(400).json({ ok: false, error: 'projects 배열이 필요합니다' });
    }
    writeProjects(projects);
    res.json({ ok: true, count: projects.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/media', (_req, res) => {
  try {
    const files = fs.readdirSync(IMG_DIR)
      .filter((name) => {
        const type = mediaTypeFromName(name);
        return type === 'image' || type === 'video';
      })
      .map((name) => ({
        src: `./img/${name}`,
        type: mediaTypeFromName(name),
        label: path.basename(name, path.extname(name)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'ko'));
    res.json({ ok: true, media: files });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/upload', requireAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });
    if (!req.file) return res.status(400).json({ ok: false, error: '파일이 없습니다' });
    res.json({
      ok: true,
      src: `./img/${req.file.filename}`,
      filename: req.file.filename,
      type: mediaTypeFromName(req.file.filename),
    });
  });
});

app.post('/api/auth/check', (req, res) => {
  if (!ADMIN_PASSWORD) return res.json({ ok: true, authRequired: false });
  const token = req.body?.token || '';
  if (token === ADMIN_PASSWORD) return res.json({ ok: true, authRequired: true });
  return res.status(401).json({ ok: false, authRequired: true, error: '비밀번호가 올바르지 않습니다' });
});

app.use(express.static(ROOT, {
  etag: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  },
}));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  NOVA SM Admin Server');
  console.log(`  → http://localhost:${PORT}/admin.html`);
  console.log(`  → http://localhost:${PORT}/portfolio.html`);
  if (ADMIN_PASSWORD) console.log('  Auth: ADMIN_PASSWORD enabled');
  else console.log('  Auth: off (local). Set ADMIN_PASSWORD to protect writes.');
  console.log('');
});
