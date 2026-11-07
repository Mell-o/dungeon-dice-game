import { usernameExists, addUser } from '../db/users.js'

export async function registerUser(req, res) {
    try {
        const {name, username, password} = req.body

        if (!name || !username || !password) {
            return res.status(400).json({error: 'All fields are required.'})
        }

        name.trim()
        username.trim()

        if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
            return res.status(400).json({error: 'Username must be 1-20 characters, using letters, numbers, _ or -.'})
        }

        const hasUsername = await usernameExists()

        if (hasUsername) {
            return res.status(400).json({error: 'Username already in use.'})
        }

        req.session.userId =  await addUser(name, username, password)
        res.status(200).json({message: 'Logged in'})
        
    } catch(err) {

        return res.status(500).json({message: 'Registration failed. Please try again.', error: err})

    }
}