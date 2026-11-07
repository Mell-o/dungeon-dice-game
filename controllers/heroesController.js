export function createHeroesController(engine) {
    async function getHeroes(req, res) {
        return res.status(200).json({heroes: engine.getHeroes()})
    }

    return {
        getHeroes
    }
}