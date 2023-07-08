//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')
  .then(() => console.log('Connected!'));

const articleSchema = {
    title:String,
    content:String
}

const Article = new mongoose.model("article",articleSchema)

//Routing using chain methods.
/////////////////////////////////Request targetting all articles //////////////////////////

app.route("/articles")
//Get Method
.get(function(req,res){
  //finding all method to display
  Article.find({}).then(function(result){
      res.send(result);
  }).catch(function(err){
    res.send(err);
  })
})
//Post Method
.post(function(req,res){
  //creating new Item and save into our database.
   const Item = new Article({
     title:req.body.title,
     content:req.body.content
   })

   Item.save().then(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully saved !!")
    }
   });
})
//Delete Method 
.delete(function(req,res){
  Article.deleteMany({}).then(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully deleted all articles");
    }
  })
});

/////////////////////////////////Request targetting all articles //////////////////////////


/* Normal Methods to Used.
//GET method.
app.get("/articles",)

//POST method
app.post("/articles",)

//DELETE method

app.delete("/articles",)*/

/////////////////////////////////Request targetting specific articles //////////////////////////


app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle}).then(function(result){
    res.send(result);
  }).catch(function(err){
    res.send("Not Available !!");
  })
})

.put(function(req,res){
  Article.updateOne({title:req.params.articleTitle}, 
    {title:req.body.title,
      content:req.body.content}).then(function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : "+ docs);
        res.send("Updated")
    }
});
})

.patch(function(req,res){
  Article.updateOne({title:req.params.articleTitle},
    {$set:req.body}).then(function(err){
      if(!err){
        res.send("Ok");
      }else{
        res.send(err);
      }
    })
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle})
  .then(function(err){
    if(err){
      res.send(err)
    }else{
      res.send("Ok")
    }
  })
});

/////////////////////////////////Request targetting specific articles //////////////////////////

app.listen(3000, function() {
  console.log("Server started on port 3000");
});