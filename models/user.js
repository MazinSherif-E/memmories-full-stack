const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{ type: String, required: true, trim: true, },
        email:{ type: String, required: true, trim: true, required: true, unique: true},
    password:{ type: String },
    confirmPassword: { type: String },

    id:{ type: String },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;