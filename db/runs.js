import { getDBConnection } from "./db.js";

async function createRunsTable() {
    const db = await getDBConnection()

    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL DEFAULT 0,
            total_battles INTEGER NOT NULL DEFAULT 0,
            wins INTEGER NOT NULL DEFAULT 0,
            losses INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log('Runs table created or already exists')

    } catch (err) {

        console.error('Failed to create runs table', err)

    }

    await db.close()
    console.log('Database connection closed')

}

export async function createRun(userId) {
    await createRunsTable()
    const db = await getDBConnection()

    try {

        const result = await db.run(`INSERT INTO runs (user_id) VALUES (?)`, [userId])
        console.log(result)
        return result.lastID

    } catch (err) {

        console.error('Failed to add new run', err)

    } finally {

        await db.close()
        console.log('Database connection closed')

    }
}

export async function updateRunStats(runId, outcome) {
    await createRunsTable()
    const db = await getDBConnection()
    let statement = (`UPDATE runs SET`)

    if (outcome === 'player_win') {
        statement += ' wins = wins + 1,'
    } else if (outcome === 'player_loss') {
        statement += ' losses = losses + 1,'
    }

    statement += ' total_battles = total_battles + 1 WHERE id = ?'

    try {
        console.log(statement, runId)
        await db.run(statement, runId)
        console.log('Run has been updated')

    } catch (err) {

        console.error("Couldn't update run", err)

    } finally {
        const rows = await db.all(`SELECT * FROM runs`)
        console.table(rows)
        await db.close()
        console.log('Database connection closed')
    }
}