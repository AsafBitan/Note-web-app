const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user');
const { response } = require('express');
const loger = require("../loger");

// GET all users
usersRouter.get('/', async (request, response) => {
    loger(request);
    const users = await User.find({})
    response.json(users)
});

// Creat new user
usersRouter.post('/', async (request, response) => {
    const { name, email, username, password} = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        email,
        username, 
        passwordHash
    });
    try{
        const savedUser = await user.save();

        response.status(201).json(savedUser);
    }catch{
        response.status(400).json({ error: "Error creating new user"});
    }
}); 

module.exports = usersRouter