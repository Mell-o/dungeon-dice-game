import { usernameExists, addUser, getUser } from '../db/users.js'
import bcrypt from 'bcryptjs'

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

        const hashed = await bcrypt.hash(password, 10)

        req.session.userId =  await addUser(name, username, hashed)
        res.status(200).json({message: 'Logged in'})
        
    } catch(err) {
        console.error('Failed to register user:', err)
        return res.status(500).json({message: 'Registration failed. Please try again.', error: err})

    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({error: 'All fields are required'})
        }

        username.trim()

        const user = await getUser(username)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({error: 'Invalid credentials'})
        }

        req.session.userId = user.id
        res.status(200).json({message: 'Logged in'})

    } catch(err) {

        console.error('Failed to login user:', err)
        return res.status(500).json({
            message: 'Login failed. Please try again.', error: err
        })

    }
}

export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        
        if (err) {
            console.error('Session destruction error:', err)
            return res.status(500).send('Could not log out.')
        }

        res.clearCookie('connect.sid')
        res.status(200).json({message: 'Logged out'})

    })
}