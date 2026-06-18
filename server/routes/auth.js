const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const { JWT_SECRET, authMiddleware } = require('../middleware/auth')
const {
  cleanString,
  isValidEmail,
  normalizeEmail,
  normalizePassword,
} = require('../validation')

function publicUser(user) {
  return { id: user.id, email: user.email, nickname: user.nickname }
}

function issueToken(user) {
  return jwt.sign(
    { sub: String(user.id) },
    JWT_SECRET,
    {
      expiresIn: '7d',
      issuer: 'honbap',
      audience: 'honbap-web',
    }
  )
}

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { email, password, nickname } = req.body || {}

    const e = normalizeEmail(email)
    const p = normalizePassword(password)
    const n = cleanString(nickname, 20)

    if (!e || !p || !n) {
      return res.status(400).json({ error: '모든 항목을 입력해 주세요.' })
    }
    if (!isValidEmail(e)) {
      return res.status(400).json({ error: '이메일 형식이 올바르지 않아요.' })
    }
    if (n.length < 2) {
      return res.status(400).json({ error: '닉네임은 2자 이상이어야 해요.' })
    }
    if (p.length < 8 || p.length > 128) {
      return res.status(400).json({ error: '비밀번호는 8자 이상 128자 이하여야 해요.' })
    }

    if (db.users.findByEmail(e)) {
      return res.status(409).json({ error: '이미 가입된 이메일이에요.' })
    }

    const passwordHash = await bcrypt.hash(p, 12)
    const newUser = db.users.create({ email: e, nickname: n, passwordHash })

    const user = publicUser(newUser)
    const token = issueToken(newUser)

    res.json({ token, user })
  } catch (err) {
    console.error('Signup failed:', err)
    res.status(500).json({ error: '회원가입 처리 중 오류가 발생했어요.' })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const e = normalizeEmail(email)
    const p = normalizePassword(password)

    if (!e || !p) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해 주세요.' })
    }

    const found = db.users.findByEmail(e)

    if (!found || !(await bcrypt.compare(p, found.password_hash))) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않아요.' })
    }

    const user = publicUser(found)
    const token = issueToken(found)

    res.json({ token, user })
  } catch (err) {
    console.error('Login failed:', err)
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했어요.' })
  }
})

// 현재 로그인 사용자 확인
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
