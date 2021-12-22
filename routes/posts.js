const router = require('express').Router()
const {loginAuth} = require('../middleware')

router.get('/posts', loginAuth, (req,res)=>{
    // res.json({
    //     posts:{
    //         title:'postName',
    //         desc:"asdasdasdasdasdasdasdasdasd"
    //     }
    // })
    res.send(req.user)
})

module.exports = router