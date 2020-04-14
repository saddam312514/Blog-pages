const {body} = require('express-validator')
const validator = require('validator')
const linkValidator = value => {
    if(value){
        if(!validator.isURL(value)){
            throw new Error('Provide valid Url')
        }
    }
    return true
}
module.exports = [
    body('name')
    .not()
    .isEmpty()
    .withMessage('Name Can not Be Empty')
    .isLength({max: 50}).withMessage('Name can not be More than 50').trim(),
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title can not be Empty')
    .isLength({max: 100}).withMessage('title can not be more than 100 chars').trim()
    ,
    body('bio')
    .not()
    .isEmpty()
    .withMessage('Bio can not be empty')
    .isLength({max: 500}).withMessage('Bio can not be more than 500 chars').trim(),
    body('website')
    .custom(linkValidator),
    body('facebook')
    .custom(linkValidator),
    body('twitter')
    .custom(linkValidator),
    body('github')
    .custom(linkValidator)
]