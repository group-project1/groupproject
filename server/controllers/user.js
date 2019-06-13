const User = require('../models/user')

class UserController{
    
    static getAll(req,res,next){
        User
        .find({})
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        User
        .findById(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static register(req,res,next){
        let user = new User({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        user.save()
        .then(value =>[
            res.status(201).json(value)
        ])
        .catch(next)
    }

    static login(req,res,next){
        User
        .findOne({email : req.body.email})
        .then(user =>{
            if(user){
                console.log('ini user',user);
                if(compare(req.body.password,user.password)){
                    let payload = {
                        email : user.email,
                        id : user.id
                    }
                    let token = sign(payload)
                    res.status(200).json({
                        token,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        id : user.id
                    })
                }else {
                    console.log('masuk error 1');
                    
                    throw { code : 404, msg : `username/password salah`}
                }  
            }else{
                console.log('masuk error 2');
                
                throw { code : 404, msg : `username/password salah`}
            }
        })
        .catch(next)
    }

    static loginGoogle(req,res,next){

    }

    static update(req,res,next){
        let setVal = {}
        req.body.firstName && (setVal.firstName = req.body.firstName) 
        req.body.lastName && (setVal.lastName = req.body.lastName)
        req.body.email && (setVal.dueDate = req.body.dueDate)
        
        User
        .findById(req.params.userId)
        .then(user =>{
            user.set(setVal)
            return user.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        User
        .findByIdAndDelete(req.params.id)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }


}

module.exports = UserController