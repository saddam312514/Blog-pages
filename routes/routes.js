const authRoute = require('./authRoute')
const dashboarRoute = require('./dashboardRoute')
const playgroundRoute = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const apiRoutes = require('../api/routes/apiRoutes')
const exploreRoute = require('./explorerRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')

const routes = [
    {
        path:'/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboarRoute
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/post',
        handler: postRoute
    },
    {
        path: '/search',
        handler: searchRoute

    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/api',
        handler: apiRoutes

    },
    {
        path: '/explorer',
        handler: exploreRoute

    },
 
    {
        path: '/playground',
        handler: playgroundRoute
    },
    {
        path: '/',
        handler: (req,res) => {
          res.redirect('/explorer')
        }
    }
]
module.exports = app => {
    routes.forEach(r => {
        if(r.path === '/'){
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}