const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const postValidator = require('../validator/dashboard/post/postValidator')
const upload = require('../middleware/uploadmiddleware')

const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    DeletePostGetController,
    postGetController
    
} = require('../controllers/postController')

router.get('/create',isAuthenticated, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)
router.get('/edit/:postId', isAuthenticated,editPostGetController)
router.post('/edit/:postId',isAuthenticated,upload.single('post-thumbnail'), postValidator, editPostPostController)
router.get('/delete/:postId',isAuthenticated,DeletePostGetController)
router.get('/', isAuthenticated,postGetController)
module.exports = router