const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
require('dotenv').config({ path: path.join(__dirname, '.env') })
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const fs = require('fs')

const app = express()
const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...parseOrigins(process.env.CLIENT_ORIGIN),
  process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null,
].filter(Boolean)

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'", ...allowedOrigins],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.unsplash.com'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
}))
app.use(express.json({ limit: '32kb' }))
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(null, false)
  },
  credentials: true,
}))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.' },
})

const recommendLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '추천 요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' },
})

app.use('/api', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/signup', authLimiter)
app.use('/api/recommend', recommendLimiter)

app.use('/api/auth',      require('./routes/auth'))
app.use('/api/records',   require('./routes/records'))
app.use('/api/videos',    require('./routes/videos'))
app.use('/api/recommend', require('./routes/recommend'))

// 헬스 체크
app.get('/api/health', (_, res) => res.json({ ok: true }))

app.use('/api', (_, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((err, req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: '요청 데이터가 너무 큽니다.' })
  }
  console.error('Unhandled server error:', err)
  res.status(500).json({ error: '서버 오류가 발생했어요.' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\n🍜 오늘 뭐 먹지? 서버 실행 중 → http://localhost:${PORT}`)
  console.log('   Ctrl+C 로 종료\n')
})
