const BankModel = require('../models/bank');
const AccountModel = require('../models/account');
const {validationResult} = require('express-validator');

const listBanksController = (req, res) => {
    //list all banks
    const { id } = req.params;

    if(id){
        BankModel.find({_id: id}).then( banks => {
            res.json({data: banks});
        }).catch( err => console.log(err));
    }else{
        BankModel.find().then( banks => {
            res.json({data: banks});
        }).catch( err => console.log(err));
    }

   
    
}

const createBankController = (req, res) => {
    //create a bank
    //validation checks
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.json({message: errors.array()[0].msg});
    }
    const {_id, name, location, branch, phone, address, accountNumber} = req.body;

    const bank = new BankModel({_id, name, location, branch, phone, address, accountNumber});

    bank.save().then( result => {
        res.json({message: "create successful", data: bank});
    }).catch(error => console.log(error));

    
}

const updateBankController = (req, res) => {
    //update a bank

    const {id, name, location, branch, phone, address, accountNumber} = req.body;
     
    BankModel.findById(id).then( bank => {
        if(bank){
            bank.name = name;
            bank.location = location;
            bank.branch = branch;
            bank.phone = phone;
            bank.address = address;
            bank.accountNumber = accountNumber;

            bank.save();

            res.json({message: "update successful", data: banks[0]});
        }

        res.json({message: "Document cannot be found"});
    }).catch(err => console.log(err));
//    const updatedBank = BankModel.update({name, location, branch, phone, address, accountNumber});

//    
}

const deleteBankController = (req, res) => {
    //delete a bank
    const {id} =req.body
   BankModel.findByIdAndRemove(id).then( deletedBank => {
          if(deletedBank){

            AccountModel.deleteMany({bankId: deletedBank._id}).then( result => {
               
                res.json({message: "bank deleted", data: deletedBank});

            }).catch(err => console.log(err));
            
            return;
          }

          res.json({message: "bank not found"});
   });
 
}

module.exports = {
    listBanksController,
    updateBankController,
    createBankController,
    deleteBankController,
}     