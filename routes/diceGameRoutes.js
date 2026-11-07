import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import { createBattleController } from '../controllers/battleController.js';
import express from 'express'

const engine = createDiceGameEngine();
const battleController = createBattleController(engine)

export const diceGameRoutes = express.Router()

diceGameRoutes.get('/heroes', (req, res) => { 
    res.status(200).json({heroes: engine.getHeroes()})
})

diceGameRoutes.post('/battle/start', battleController.startBattle)

diceGameRoutes.post('/battle/round', battleController.playRound)

diceGameRoutes.post('/battle/reset', battleController.resetBattle)