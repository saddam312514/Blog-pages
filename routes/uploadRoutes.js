const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadmiddleware')

const {
 uploadProfilePics,
 removeProfilePics,
 postImageUploadController
} = require('../controllers/uploadController')

router.post('/profilePics',
isAuthenticated,upload.single('profilePics'),
uploadProfilePics,
removeProfilePics,


)
router.post('/profilePics',isAuthenticated,upload.single('profilePics'),uploadProfilePics)
router.delete('/profilePics',isAuthenticated,removeProfilePics)
router.post('/postimage',isAuthenticated,upload.single('post-image'),postImageUploadController)



module.exports = router