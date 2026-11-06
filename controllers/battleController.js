import { createRun, updateRunStats } from '../db/runs.js'

export function createBattleController(engine) {
    async function startBattle(req, res) {
        if (!req.body.heroId) {
            return res.status(400).json({message: 'Hero ID is required'})
        }

        
        if (!req.session.userId) {
            req.session.userId = 1
            console.log('session userId set to 1')
        }

        if (!req.session.runId) {
            req.session.runId = await createRun(req.session.userId)
        }
        
        console.log('req.session.runId', req.session.runId)

        const result = await engine.startBattle(req.body.heroId)
        return res.status(200).json(result)
    }

    async function playRound(req, res) {
        const result = engine.playRound()

        const outcome = result.outcome

        if (outcome !== 'ongoing') {
            updateRunStats(req.session.runId, outcome)
        }

        return res.json(result)
    }

    async function resetBattle(req, res) {
        engine.resetBattle()
        return res.status(200).json({message: 'Battle reset.'})
    }

    return {
        startBattle,
        playRound,
        resetBattle
    }
}