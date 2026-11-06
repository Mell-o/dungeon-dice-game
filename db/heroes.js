import { getDBConnection } from './db.js'
import { heroes } from "../data/heroes.js";

async function createHeroesTable() {

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

export async function seedHeroesTable() {
    const db = await getDBConnection()

    try {
        await db.exec('BEGIN TRANSACTION')

        for (const {name, attackPower, defensePower, maxHp, imageUrl} of heroes) {
            await db.run(`
                INSERT INTO heroes (name, attackPower, defensePower, maxHp, imageUrl)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (name)
                DO NOTHING`,
                [name, attackPower, defensePower, maxHp, imageUrl]
            )
        }

        await db.exec('COMMIT')
        console.log('All heroes inserted successfully')

    } catch (err) {

        await db.exec('ROLLBACK')
        console.error('Error inserting data:', err.message)

    } finally {

        await db.close()
        console.log('Database connection closed.')

    }
}

export async function getHeroesData() {
    await createHeroesTable()
    await seedHeroesTable()
    const db = await getDBConnection()

    try {

        console.log('Heroes data has been retrieved')
        return await db.all('SELECT * FROM heroes')

    } catch (err) {

        console.error('Failed to retrieve heroes data', err)

    } finally {

        await db.close()
        console.log('Database connection closed')

    }
}