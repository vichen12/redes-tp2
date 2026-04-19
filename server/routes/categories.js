const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM custom_categories ORDER BY id ASC').all())
})

router.post('/', (req, res) => {
  const { type, label, emoji, color } = req.body
  const result = db.prepare('INSERT INTO custom_categories (type, label, emoji, color) VALUES (?, ?, ?, ?)').run(type, label, emoji, color)
  res.json({ id: result.lastInsertRowid })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM custom_categories WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
