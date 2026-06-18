// 순수 JS JSON 파일 기반 DB (네이티브 의존성 없음, Node.js 26 호환)
const fs = require('fs')
const path = require('path')

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : __dirname
const DB_FILE = path.join(DATA_DIR, 'honbap.json')

let _data = { users: [], eat_records: [], video_views: [] }

function normalizeData(data) {
  return {
    users: Array.isArray(data?.users) ? data.users : [],
    eat_records: Array.isArray(data?.eat_records) ? data.eat_records : [],
    video_views: Array.isArray(data?.video_views) ? data.video_views : [],
  }
}

fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 })

// 시작 시 파일에서 로드
try {
  if (fs.existsSync(DB_FILE)) {
    _data = normalizeData(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')))
    try {
      fs.chmodSync(DB_FILE, 0o600)
    } catch {
      // 일부 배포 파일시스템에서는 chmod가 제한될 수 있습니다.
    }
  }
} catch (e) {
  console.error('DB 로드 실패, 초기화:', e.message)
}

function save() {
  const tmp = `${DB_FILE}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(_data, null, 2), { encoding: 'utf8', mode: 0o600 })
  fs.renameSync(tmp, DB_FILE)
}

const db = {
  // ─── users ───────────────────────────────────────────────
  users: {
    findByEmail(email) {
      return _data.users.find((u) => u.email === email) || null
    },
    findById(id) {
      return _data.users.find((u) => u.id === id) || null
    },
    create({ email, nickname, passwordHash }) {
      const id = _data.users.length
        ? Math.max(..._data.users.map((u) => u.id)) + 1
        : 1
      const user = {
        id,
        email,
        nickname,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      }
      _data.users.push(user)
      save()
      return user
    },
  },

  // ─── eat_records ─────────────────────────────────────────
  records: {
    findByUserId(userId) {
      return _data.eat_records
        .filter((r) => r.user_id === userId)
        .sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date)
          return b.created_at.localeCompare(a.created_at)
        })
    },
    findOne(id, userId) {
      return _data.eat_records.find((r) => r.id === id && r.user_id === userId) || null
    },
    create(record) {
      _data.eat_records.push(record)
      save()
      return record
    },
    delete(id, userId) {
      const idx = _data.eat_records.findIndex((r) => r.id === id && r.user_id === userId)
      if (idx === -1) return false
      _data.eat_records.splice(idx, 1)
      save()
      return true
    },
    updateRating(id, userId, rating) {
      const r = _data.eat_records.find((r) => r.id === id && r.user_id === userId)
      if (!r) return false
      r.rating = rating
      save()
      return true
    },
  },

  // ─── video_views ─────────────────────────────────────────
  videos: {
    findByUserId(userId, limit = 200) {
      return _data.video_views
        .filter((v) => v.user_id === userId)
        .sort((a, b) => b.viewed_at.localeCompare(a.viewed_at))
        .slice(0, limit)
    },
    create(view) {
      _data.video_views.push(view)
      save()
      return view
    },
  },
}

module.exports = db
