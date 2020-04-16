const express = require('express');

var router = express.Router();


router.get('/',(req,res)=>{
    res.render('homepage')
})

module.exports = router;