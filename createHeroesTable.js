import { getDBConnection } from './db/db.js'

export async function createHeroesTable() {

    const db = await getDBConnection()

    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS heroes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                attackPower INTEGER NOT NULL,
                defensePower INTEGER NOT NULL,
                maxHp INTEGER NOT NULL,
                imageUrl TEXT NOT NULL
            );

            CREATE UNIQUE INDEX IF NOT EXISTS idx_name ON heroes(name);
        `)

        console.log('Table created or already exists')

    } catch (err) {

        console.error('Error creating heroes table', err)

    } finally {

        await db.close()
        console.log('Database connection closed')

    }
}