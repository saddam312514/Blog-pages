const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
    .not()
    .isEmpty().withMessage('Title can not be Empty')
    .isLength({max: 100}).withMessage('Title Can not be Greater than 100 Chars')
    .trim(),
    body('body')
    .not().isEmpty().withMessage('Body Can not Be Empty')
    .custom(value => {
        let node = cheerio.load(value)
        let text = node.text()
        if(text.length > 5000){
            throw new Error ('Body Can not be Grater than 5000 Chars')
        }
        return true
    })
]