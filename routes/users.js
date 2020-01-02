import express from 'express';
import User from '../models/userModel';

var router=express.Router();

router.get('/all', (req, res) => {
  User.find({}, (err, result) => {
    if(err){
      console.log("Error in fetching the user data");
    }
    let response = {};
    if(result){
      response = Object.assign({message: 'User Details', userDetails: result});
      res.send(response);
    } else{
      res.send({message: 'No users'})
    }
  })
})

router.get('/', (req, res, next) => {
  User.find({userName: req.query.userName}, (err, result) => {
    if(err){
      console.log("Error in the finding result");
    }
    let response = result[0];
    if(response){
      response = Object.assign({message: 'Logged in successfully'}, response._doc)
      res.send(response);
    } else {
      res.send({message: 'Not a Valid User'});
    }
  });
});

router.delete('/', (req, res, next) => {
  User.remove({userName:req.query.userName}, (err,result) => {
    if(err){
      console.log("Error in deleting the user")
    }
    res.send({message: "Deleted successfully"});
  });
});

router.put('/', (req, res,next) => {
  User.update({userName: req.query.userName}, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }, (err, result) =>{
    if(err){
      console.log("Error in updating the values");
    }
    User.find({userName: req.body.userName}, (err, result) => {
      if(err){
        console.log("Error in the finding result");
      }
      let response = result[0];
      if(response){
        response = Object.assign({message: 'Upadted successfully'}, response._doc)
        res.send(response);
      } else {
        res.send({message: 'Not a Valid User'});
      }
    });
    // console.log("Result ====>", result);
    // res.send({message: "Updated successfully"});
  })
})

router.post('/register', (req, res, next) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  user.save().then(result => {
    console.log("Result from the mongodb ====>", result);
    res.send(result);
  })
});

router.post('/login', (req, res, next) => {
  console.log("Password from the request =======>", req.body)
  User.find({userName: req.body.userName}, (err, result) => {
    if(err){
      console.log("Error in the finding result");
    }
    let response = result[0];
    if(response){
      if(response.password === req.body.password){
        response = Object.assign({message: 'Logged in successfully'}, response._doc)
        res.send(response);
      } else {
        res.send({message: 'Incorrect Password'});
      }
    } else {
      res.send({message: 'Not a Valid User'});
    }
  });
})

export default router;