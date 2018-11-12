const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    console.log(req.body);
    
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'user created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });

    });
});

router.post("/login", (req, res, next) => {
    let fetcheduser;
    User.findOne({email: req.body.email})
        .then( user => {
            if(!user){
                return res.status(401).json({
                    message:"Auth failed"
                });
            }
            fetcheduser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then( result => {
            if(!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign({email: fetcheduser.email, userId: fetcheduser._id}, 'secret_this_should_be-longer', {expiresIn: "1h"});

            res.status(200).json({
                message: "token",
                token: token
            })
        })
        .catch ( err => {
            res.status(401).json({
                message:"Auth failed"
            })
        })
});

module.exports = router;
