const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try{
        if (await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists' })
        }

        const user = await User.create(req.body);

        //apaga assim que o usuario é criado para n retornar para ele na tela
        user.password = undefined;
    
        return res.send(user);
    }
    catch(err){
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/auth', router);