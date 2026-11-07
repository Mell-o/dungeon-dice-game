import express from 'express'
import session from 'express-session'
import { diceGameRoutes } from './routes/diceGameRoutes.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'

const app = express()
const PORT = process.env.PORT || 9000
const secret = process.env.DICE_GAME_SECRET || 'O-)xiYQ*tWd|PDpB'

app.use(express.json())

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}))

app.use(express.static('public'))

app.use('/api/auth/me', meRouter)
app.use('/api/auth', authRouter)
app.use('/api', diceGameRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Failed to start server:', err)
})