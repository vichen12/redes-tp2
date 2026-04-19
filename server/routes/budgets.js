const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM budgets ORDER BY id ASC').all())
})

router.post('/', (req, res) => {
  const { category, monthly_limit } = req.body
  const result = db.prepare('INSERT OR REPLACE INTO budgets (category, monthly_limit) VALUES (?, ?)').run(category, Number(monthly_limit))
  res.json({ id: result.lastInsertRowid })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM budgets WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
