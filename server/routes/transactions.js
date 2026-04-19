const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  const { month } = req.query
  if (month) {
    res.json(db.prepare('SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC').all(`${month}%`))
  } else {
    res.json(db.prepare('SELECT * FROM transactions ORDER BY date DESC').all())
  }
})

router.get('/summary/:month', (req, res) => {
  const like = `${req.params.month}%`
  const ingresos = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='ingreso' AND date LIKE ?").get(like).total
  const gastos = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='gasto' AND date LIKE ?").get(like).total
  const byCategory = db.prepare("SELECT category, SUM(amount) as total FROM transactions WHERE type='gasto' AND date LIKE ? GROUP BY category ORDER BY total DESC").all(like)
  res.json({ ingresos, gastos, ahorro: ingresos - gastos, byCategory })
})

router.post('/', (req, res) => {
  const { type, amount, description, category, date } = req.body
  const result = db.prepare('INSERT INTO transactions (type, amount, description, category, date) VALUES (?, ?, ?, ?, ?)').run(type, Number(amount), description, category, date)
  res.json({ id: result.lastInsertRowid, type, amount: Number(amount), description, category, date })
})

router.put('/:id', (req, res) => {
  const { type, amount, description, category, date } = req.body
  db.prepare('UPDATE transactions SET type=?, amount=?, description=?, category=?, date=? WHERE id=?').run(type, Number(amount), description, category, date, req.params.id)
  res.json({ success: true })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM transactions WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
