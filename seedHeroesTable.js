import { getDBConnection } from "./db/db.js";
import { heroes } from "./data/heroes.js";

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