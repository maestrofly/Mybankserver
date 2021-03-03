const express = require('express');
const {body} = require('express-validator');
const {listBanksController, createBankController, updateBankController, deleteBankController} = require('../controllers/banks')
const isAuth = require('../middlewares/is-auth');
const BankModel = require('../models/bank');
const router = express.Router();

router.get('/banks/:id?', isAuth, listBanksController);
//create bank - post method 
router.post('/banks', isAuth, [
    body('name').trim().not().isEmpty().withMessage('Name cannot be empty'),
    body('location').trim().not().isEmpty().withMessage('Location cannot be empty'),
    body('branch').trim().not().isEmpty().withMessage('Branch cannot be empty'),
    body('phone').isMobilePhone("en-GH")
    .custom((value, {req}) => {
        return BankModel.findOne({'phone': value}).then(
            bankDoc => {
                if(bankDoc)
                     return Promise.reject('Phone number already taken');
            }
        )
    })
], createBankController);
//update bank - put method
router.put('/bank', isAuth, updateBankController);
//delete bank - delete method
router.delete('/bank', isAuth, deleteBankController);

module.exports = router;