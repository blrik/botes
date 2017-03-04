const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    res.render('layout', {
        page_title: 'Home',
        page_ID: 'home'
    });
});


module.exports = router;