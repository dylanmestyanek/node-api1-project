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
    if (!Object.keys(newUser).includes("name") || !Object.keys(newUser).includes("bio")){
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    
    db.insert(newUser)
        .then(data => res.status(201).json(newUser))
        .catch(err => {
            console.log("Failed to add new user", err)
            res.status(500).json({ error: "There was an error while saving the user to the database."})
        })
})


const port = 5000;
server.listen(port, (req, res) => console.log("\n Yo! Listening on port 5000 dude! :D \n"))