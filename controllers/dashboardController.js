const {validationResult} = require('express-validator')
const Flash = require('../utils/Flash')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Comment = require('../models/Comment')
const errorFormatter = require('../utils/validationErrorFormatter')
exports.dashboardGetController = async (req,res,next) => {

    try
    {
        let profile = await Profile.findOne(
            {
            user: req.user._id
        })
        .populate({
            path: 'posts',
            select: 'title thumbnail'
        })
        .populate({
            path: 'bookmarks',
            select: 'title thumbnail'
        })
            
        if(profile){
           return res.render('pages/dashboard/dashboard',
            {
                title: 'My Dashboard',
                flashMessage:Flash.geMessage(req),
                posts: profile.posts.reverse().slice(0,3),
                bookmarks: profile.bookmarks.reverse().slice(0,3)
               })
        }
        res.redirect('/dashboard/create-profile')
    }catch(e){
        next(e)
    }
    
}

exports.createProfileGetController = async (req,res,next) =>{
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        })
            
        if(profile){
               return res.redirect('/dashboard/edit-profile')
           
            }
          res.render('pages/dashboard/create-profile',
        {title: 'Create your profile',
    flashMessage: Flash.geMessage(req),
    error: {}
    }
            )
    }catch(e){
        next(e)
    }
   
}

exports.createProfilePostController = async (req,res,next) =>{
   let errors = validationResult(req).formatWith(errorFormatter)
   if(!errors.isEmpty()){
   return res.render('pages/dashboard/create-profile', {
        title: 'Create Your Profile',
        flashMessage: Flash.geMessage(req),
        error: errors.mapped()
    })
   }
  let {
    name,
    title,
    bio,
    website,
    facebook,
    twitter,
    github
  } = req.body
  try{
      let profile = new Profile({
          user: req.user._id,
          name,
          title,
          bio,
          profilePics: req.user.profilePics,
          links: {
              website: website || '',
              facebook: facebook || '',
              twitter: twitter || '',
              github: github || ''
          },
          posts: [],
          booksmarks: []
      }) 
      let createdProfile =  await profile.save()
      await User.findOneAndUpdate(
          {_id: req.user._id},
          {$set: {profile: createdProfile._id}}
      )
      req.flash('success', 'Profile Created Successfully')
      res.redirect('/dashboard')

  }catch(e){
      next(e)
  }




}
exports.editProfileGetController = async (req,res,next) =>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(!profile){
            return res.redirect('/dashboard/create-profile')
        }
        res.render('pages/dashboard/edit-profile',{
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.geMessage(req),
            profile
        })

    }catch(e){
        next(e) 
    }
}
exports.editProfilePostController = async(req,res,next) => {
    let errors = validationResult(req).formatWith(errorFormatter)

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
      } = req.body

    if(!errors.isEmpty()){
    return res.render('pages/dashboard/create-profile', {
         title: 'Create Your Profile',
         flashMessage: Flash.geMessage(req),
         error: errors.mapped(),
         profile : {
             name,
             title,
             bio,
             links: {
                 website,
                 facebook,
                 twitter,
                 github
             }

         }
     })
    }
    try {
        let profile = {
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            }
            
        }
        let updatedProfile = await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$set: profile},
            {new: true}
        )
        req.flash('success','Profile Updated Successfully')
        res.render('pages/dashboard/edit-profile',{
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.geMessage(req),
            profile: updatedProfile
        })

    }catch(e){
        next(e)
    }
}

exports.bookmarksGetController = async (req,res,next) =>{
 try{
     let profile = await Profile.findOne({user: req.user._id})
     .populate({
         path: 'bookmarks',
         model: 'Post',
         select: 'title Thumbnail'
     })
    
     res.render('pages/dashboard/bookmarks',{
        title: 'My Bookmarks',
        flashMessage: Flash.geMessage(req),
        posts: profile.bookmarks

        
    })

 }catch(e){
     next(e)
 }
}

exports.commentGetController = async(req,res,next) => {
    try{
        let profile = await Profile.findOne({user: req.user._id})
        let comments = await Comment.find({post: {$in: profile.posts}})
        .populate({
            path: 'post',
            select: 'title'
        })
        .populate({
            path: 'user',
            select: 'username profilePics'
        })
        .populate({
            path: 'repiles.user',
            select: 'username profilePics'
        })
        res.render('pages/dashboard/comments',{
            title: 'My Recent Comments',
            flashMessage: Flash.geMessage(req),
            comments

        })
       

    }catch(e){
        next(e)
    }
}