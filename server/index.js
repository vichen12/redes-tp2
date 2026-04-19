const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/transactions', require('./routes/transactions'))
app.use('/api/goals', require('./routes/goals'))
app.use('/api/budgets', require('./routes/budgets'))
app.use('/api/categories', require('./routes/categories'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`TuFinanza server corriendo en http://localhost:${PORT}`))
