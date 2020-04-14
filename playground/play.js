const router = require('express').Router()
const upload = require('../middleware/uploadmiddleware')

router.get('/play', (req,res) =>{
   res.render('playground/play', {title: 'Playground', flashMessage: {}})
})
router.post('/play', upload.single('my-file'), (req,res) =>{
   if(req.file){
       console.log(file)
   }
    res.redirect('/playground/play')
})

module.exports = router