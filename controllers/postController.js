const Flash = require('../utils/Flash')
const {validationResult} = require('express-validator')
const readingTime = require('reading-time')
const errorFormatter = require('../utils/validationErrorFormatter')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
exports.createPostGetController = (req,res,next) => {
    res.render('pages/dashboard/post/createPost',{
        title: 'Create A New Post',
        error: {},
        flashMessage: Flash.geMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req,res,next)=>{
    let {title,body,tags} = req.body
    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
       return res.render('pages/dashboard/post/createPost',{
            title: 'Create A New Post',
            error: errors.mapped(),
            flashMessage: Flash.geMessage(req),
            value : {
                title,
                body,
                tags
            }

        })
    }
    if(tags){
        tags = tags.split(',')
    }
    let readTime = readingTime(body).text
    let post =  new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []

    })
    if(req.file){
        post.thumbnail = `/uploads${req.file.filename}`
    }
    try {
        let createPost = await post.save()
        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$push: {'posts': createPost._id}}
        )
        req.flash('success', 'Post Created Successfully')
        return res.redirect(`/post/edit/${createPost._id}`)

    }catch(e){
        next(e)
    }
    
}
exports.editPostGetController = async(req,res,next) =>{
    let postId = req.params.postId
    try{
        let post = await Post.findOne({
            author: req.user._id, _id: postId
        })
        if(!post){
            let error = new Error('404 Page not Foudn')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost',{
            title: "Edit Your Post",
            error: {},
            flashMessage: Flash.geMessage(req),
            post
        })
        

    }catch(e)
    {
        next(e)
    }
}

exports.editPostPostController = async (req,res,next) => {
    let {title,body,tags} = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)

    try{
        let post = await Post.findOne({author: req.user._id, _id: postId})

        if(!post){
            let error = new Error('404 Page not Foudn')
            error.status = 404
            throw error 
        }
        if(!errors.isEmpty()){
            res.render('pages/dashboard/post/createPost',{
                title: 'Edit A new post',
                error: errors.mapped(),
                flashMessage: Flash.geMessage(req),
                post
            })
        }
        if(tags){
            tags = tags.split(',')
            tags = tags.map(t => t.trim())
        }
        let thumbnail = post.thumbnail
        if(req.file){
            thumbnail = req.file.filename
        }
         await Post.findOneAndUpdate(
            {_id: post._id},
            {$set: {title,body,tags,thumbnail}},
            {new: true}
        )
        req.flash('success', 'Post Updated Successfully')
        res.redirect('/post/edit/' + post._id)
        
    }catch(e){
        next(e)
    }


}
exports.DeletePostGetController = async(req,res,next) => {
    let {postId} = req.params
    try{
        let post = await Post.findOne({author: req.user._id, _id: postId})
        if(!post){
            let error = new Error('404 page Not Found')
            error.status = 404
            throw error
        }
        await Post.findOneAndDelete({_id: postId})
        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$pull: {'posts': postId}}
        )
        req.flash('success', 'Post Delete successfully')
        res.redirect('/posts')

    }catch(e){
        next()
    }
}
exports.postGetController = async (req,res,next) => {
    try{
        let posts = await Post.find({author: req.user._id})
        res.render('pages/dashboard/post/post',{
            title: 'Create A New Post',
            posts,
            flashMessage: Flash.geMessage(req)
            
        })
    }catch(e){
        next(e)

    }
}