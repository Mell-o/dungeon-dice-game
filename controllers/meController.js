import { getUsername } from '../db/users.js'

export async function getCurrentUser(req, res) {
    try {

        if (req.session.userId) {

            const username = await getUsername(req.session.userId)

            if (username) {
                res.status(200).json({isLoggedIn: true, name: username})
            } else {
                res.status(200).json({isLoggedIn: false})
            }

        } else {
            
            res.status(200).json({isLoggedIn: false})

        }

    } catch(err) {

        return res.status(500).json({message: 'Internal server error', error: err})

    }
}