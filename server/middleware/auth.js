const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const db = require('../db')

const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_PUBLIC_DOMAIN

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex')

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('change'))) {
  throw new Error('Production requires a strong JWT_SECRET of at least 32 characters.')
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요해요. 로그인해 주세요.' })
  }
  try {
    const token = auth.slice(7)
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'honbap',
      audience: 'honbap-web',
    })
    const userId = Number(payload.sub || payload.id)
    const found = Number.isInteger(userId) ? db.users.findById(userId) : null
    if (!found) {
      return res.status(401).json({ error: '세션이 유효하지 않아요. 다시 로그인해 주세요.' })
    }
    req.user = { id: found.id, email: found.email, nickname: found.nickname }
    next()
  } catch {
    res.status(401).json({ error: '세션이 만료됐어요. 다시 로그인해 주세요.' })
  }
}

module.exports = { authMiddleware, JWT_SECRET }
