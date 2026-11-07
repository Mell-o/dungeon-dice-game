import { getDBConnection } from './db.js'

async function createUsersTable() {
    const db = await getDBConnection()

    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)

        console.log('Users table created or already exists')
    } catch(err) {

        console.error('Failed to created users table', err)

    } finally {
        await db.close()
        console.log('Database connection closed')
    }
}

export async function usernameExists(username) {
    await createUsersTable()
    const db = await getDBConnection()

    try {

        const found = await db.get(`SELECT id FROM users WHERE username = ?`, username)
        if (found) {
            console.log('An existing username was found')
            return true
        }

        console.log('No existing username was found')

    } catch(err) {

        console.error('Failed to search for user', err)

    } finally {

        await db.close()
        console.log('Database connection closed')
        return false

    }
}

export async function addUser(name, username, password) {
    await createUsersTable()
    const db = await getDBConnection()

    try {

        const result = await db.run(`
            INSERT INTO users (name, username, password)
            VALUES (?, ?, ?)
            `,
            [name, username, password]
        )

        console.log('User successfully added')
        return result.lastID

    } catch(err) {

        console.error('Failed to add new user', err)

    } finally {

        await db.close()
        console.log('Database connection closed')

    }
}

export async function getUsername(id) {
    await createUsersTable()
    const db = await getDBConnection()

    try {

        const username = await db.get(`SELECT username FROM users WHERE id = ?`, [id])
        console.log(username)
        console.log('Successfully fetched username')
        return username

    } catch(err) {

        console.error('Failed to fetch username', err)

    } finally {
        await db.close()
        console.log('Database connection closed')
    }
}