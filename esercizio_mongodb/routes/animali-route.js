const express = require('express');
const animaliController = require('../controller/animaliContoller');

const router = express.Router();

router.route('/')
    .get(animaliController.getAllAnimali)
    .post(animaliController.createAnimale);


router.route('/:id')
    .get(animaliController.getSingleAnimale)
    .patch(animaliController.updateAnimali)
    .delete(animaliController.deleteAnimale);


module.exports = router;