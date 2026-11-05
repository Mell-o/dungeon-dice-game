import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import express from 'express'

const engine = createDiceGameEngine();

export const diceGameRoutes = express.Router()

diceGameRoutes.get('/heroes', (req, res) => { 
    res.status(200).json({heroes: engine.getHeroes()})
}) 

diceGameRoutes.post('/battle/start', (req, res) => {
    if (!req.body.heroId) {
        return res.status(400).json({message: 'Hero ID is required'})
    }
    res.status(200).json(engine.startBattle(req.body.heroId))
})

diceGameRoutes.post('/battle/round', (req, res) => {
    res.json(engine.playRound())
})

diceGameRoutes.post('/battle/reset', (req, res) => {
    engine.resetBattle()
    res.status(200).json({message: 'Battle reset.'})
})