// implement your API here
const express = require("express");
const db = require("./data/db.js")
const server = express();
server.use(express.json())

// GET request to "/" on localhost:5000
server.get('/', (req, res) => {
    res.send('Is this working?')
})

// GET request to return all users
server.get('/users', (req, res) => {
    db.find()   
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log("ERROR FROM GET", err)
            res.status(500).json({ error: "The users information could not be retrieved."})
        })
})

// GET request for a specific user using dynamic route
server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.log("Failed to grab user by ID", err)
            res.status(404).json({ message: "The user with the specified ID does not exist."})
        })
})

// POST request for adding a user
server.post('/users', (req, res) => {
    const newUser = req.body;

    db.insert(newUser)
        .then(data => {
            if (!newUser.name || !newUser.bio) {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
            } else res.status(201).json(newUser)
        })
        .catch(err => {
            console.log("Failed to add new user", err)
            res.status(500).json({ error: "There was an error while saving the user to the database."})
        })
})

// DELETE request for removing a user 
server.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(user => {
            if (user === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else { 
                res.status(200).json(user)
            }
        })
        .catch(err => {
            console.log("Failed to remove user", err)
            res.status(500).json({ error: "The user could not be removed." })
        })
})

// PUT request for editing a user's info
server.put("/users/:id", (req, res) => {
    const updatedUser = req.body;
    const id = req.params.id;

    if (!updatedUser.name || !updatedUser.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.update(id, updatedUser)
            .then(updated => {
                if (updated) {
                    db.findById(id)
                        .then(user => res.status(200).json(user))
                        .catch(err => res.status(500).json({ error: "Could not find user"}))
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => res.status(500).json({ error: "The user information could not be modified." }))
    }
})

const port = 5000;
server.listen(port, (req, res) => console.log("\n Yo! Listening on port 5000 dude! :D \n"))