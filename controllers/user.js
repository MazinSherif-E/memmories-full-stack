const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const moment = require('moment')

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

const tokenList = {}

const signin = async (req, res) =>{
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email })
        if(!user) throw new Error('Email not found')
        
        const isMatch = await bcrypt.compare(password, user.password)  
        if(!isMatch) throw new Error('Password isn\'t correct')
        
        const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn:  "15m" })

        user.tokens = user.tokens.concat({ token })
        await user.save()
        res.status(201).send({ user, token })
    }catch(e){
        res.status(404).send(e.message) 
    }
}

const signup = async(req, res) =>{
    const oldUser = req.body
    const user = new User(req.body);
    
    try {
        if(user.password !== user.confirmPassword) {
            return res.status(404).send("Passwords don\'t match")
        }
        user.name = `${oldUser.firstName} ${oldUser.lastName}`
        user.password = await bcrypt.hash(user.password, 10)
        user.confirmPassword = await bcrypt.hash(user.confirmPassword, 10)
        const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET, { expiresIn: "15m" })

        user.tokens = user.tokens.concat({ token }) 

        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
} 

const me = async (req, res) => {
    res.send(req.user)
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = {signin, signup, me, logout}