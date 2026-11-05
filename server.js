import express from 'express'
import { diceGameRoutes } from './routes/diceGameRoutes.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())

app.use(express.static('public'))

app.use('/api', diceGameRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Failed to start server:', err)
})