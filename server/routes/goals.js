const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM goals ORDER BY id ASC').all())
})

router.post('/', (req, res) => {
  const { name, target_amount, color, emoji } = req.body
  const result = db.prepare('INSERT INTO goals (name, target_amount, color, emoji) VALUES (?, ?, ?, ?)').run(name, Number(target_amount), color || '#22c55e', emoji || '🎯')
  res.json({ id: result.lastInsertRowid })
})

router.post('/:id/add', (req, res) => {
  const goal = db.prepare('SELECT * FROM goals WHERE id=?').get(req.params.id)
  if (!goal) return res.status(404).json({ error: 'Not found' })
  const newAmount = Math.min(goal.target_amount, goal.current_amount + Number(req.body.amount))
  db.prepare('UPDATE goals SET current_amount=? WHERE id=?').run(newAmount, req.params.id)
  res.json({ success: true })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
