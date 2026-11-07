import express from 'express'
import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import { createHeroesController } from '../controllers/heroesController.js';
import { createBattleController } from '../controllers/battleController.js';
import { getHeroes } from "../db/heroes.js";

const heroes = await getHeroes()
const engine = createDiceGameEngine(heroes);
const heroesController = createHeroesController(engine)
const battleController = createBattleController(engine)


export const diceGameRoutes = express.Router()

diceGameRoutes.get('/heroes', heroesController.getHeroes)

diceGameRoutes.post('/battle/start', battleController.startBattle)

diceGameRoutes.post('/battle/round', battleController.playRound)

diceGameRoutes.post('/battle/reset', battleController.resetBattle)