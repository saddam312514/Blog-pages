const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const Flash = require('../utils/Flash')
const User = require('../models/User')

exports.signupGetController = (req,res) =>{


    res.render('pages/auth/signup',
     {title: 'Create A New Accoutn',
      error: {},
      value: {},
      flashMessage:Flash.geMessage(req)
    
    })
}
exports.signupPostController = async  (req,res,next) => {
    let {username,email,password} = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

   
    if(!errors.isEmpty()){
        req.flash('fail', 'please Check your Form')
      return  res.render('pages/auth/signup',
       {title: 'Create A New Accoutn',
        error: errors.mapped(),
    value: {
        username,email,password
    },
    flashMessage:Flash.geMessage(req)
    })
    }
    


    try{
        let hashPassword = await bcrypt.hash(password, 11)
        let user = new User({
            username,
            email,
            password: hashPassword
        })

         await user.save()
         req.flash('success','User Created Successfully')
       
    res.redirect('/auth/login')
    }catch(e){
        next(e)
    }
    
    
}

exports.loginGetController = (req,res) =>{

  
    res.render('pages/auth/login',
     {title: 'Login to your Account',
      error: {},
      flashMessage:Flash.geMessage(req)
    })
}
exports.loginPostController = async (req,res, next) =>{
    let {email,password} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    
    if(!errors.isEmpty()){
        req.flash('fail','Please Check your form')
      return  res.render('pages/auth/login',
       {title: 'Login to your Account',
        error: errors.mapped(),
      flashMessage:Flash.geMessage(req)
 
    })
    }
    


    try{
       let user = await User.findOne({email})
       if(!user){
           req.flash('fail', 'Please Provide valid Crdentials')

        return  res.render('pages/auth/login',
       {title: 'Login to your Account',
        error: {},
      flashMessage:Flash.geMessage(req)
 
        })
       }
       let match = await bcrypt.compare(password,user.password)
       if(!match){
           req.flash('fail', 'please provide Valid Credential')
        return  res.render('pages/auth/login',
        {title: 'Login to your Account',
         error: {},
       flashMessage:Flash.geMessage(req)
  
     })
      }
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save( err => {
          if(err){
              
              return next(err)
          }
          req.flash('success', 'Successfully Logged in')
         res.redirect('/dashboard')
      })
    
     

        
    }catch(e){
        next(e)
    }
}

exports.logoutController = (req,res) => {
  req.session.destroy(err => {
      if(err){
          return next(err)
      }
    //   req.flash('success', 'Successfully Logout')
      return res.redirect('/auth/login')
  })
}

exports.changePasswordGetController = (req,res,next) =>{
  res.render('pages/auth/changePassword',{
    title: 'Change My Password',
    flashMessage: Flash.geMessage(req)
  })
}


exports.changePasswordPostController = async (req,res,next) =>{

  let {oldPassword,newPassword,confirmPassword} = req.body
  if(newPassword !== confirmPassword){
   req.flash('fail', 'Password Dows not Math')
   return res.redirect('/auth/changePassword')

  }

try{
  let match = await bcrypt.compare(oldPassword,req.user.password)
  if(!match){
    req.flash('fail', 'Ivalid Old Password')
    res.redirect('/auth/changePassword')
  }
  let hash = await bcrypt.hash(newPassword,11)
  await User.findOneAndUpdate(
    {_id: req.user._id},
    {$set: {password: hash}}
  )
  req.flash('success', 'Password Update Successfuly')
  return res.redirect('/auth/changePassword')

}catch(e){
  next(e)
}

}