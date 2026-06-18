const crypto = require('crypto')

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}${crypto.randomBytes(8).toString('hex')}`
}

module.exports = { uid }
