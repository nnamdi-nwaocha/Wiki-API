//jshint esversion:6

// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config()  // Loading environment variables from .env file
const _ = require('lodash');


// Initializing the Express application
const app = express();

// Setting up EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware for parsing URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({
  extended: true
}));

// Serving static files from the "public" directory
app.use(express.static("public"));

// TODO: Add functionality here

// Connecting to MongoDB using Mongoose, with the connection string stored in environment variables
mongoose.connect(process.env.MONGO);

// Defining the schema for articles
const articlesSchema = {
  title: String,
  content: String
}

// Creating a Mongoose model for articles
const Article = mongoose.model("Article", articlesSchema);

// Chaining route handlers for the "/articles" route
app.route('/articles')
.get(function(req, res) {  // Handling GET requests to retrieve all articles
  Article.find({}).then(foundItems => {
    res.send(foundItems);
  });

})
.post(function(req, res){  // Handling POST requests to add a new article
  async function addDoc() {
    try {
      await Article.create({
        title: req.body.title,
        content: req.body.content
      })
      res.send('All good, article added successfully');
    } catch (error) {
      res.send(error)
      throw error;
    }
  }
  addDoc();
})
.delete(function(req, res) {  // Handling DELETE requests to delete all articles
  async function deleteAllDocs() {
    try {
      await Article.deleteMany();
      res.send('All articles deleted successfully');
    } catch (error) {
      res.send(error)
      throw error;
    }
  }
  deleteAllDocs();
});

app.route('/articles/:paramName')
.get(function(req, res){
  const originalString = req.params.paramName;
  const modifiedString = _.replace(originalString, /-/g, ' ');
  Article.find({ title: modifiedString})
  .then(foundItems => {
    res.send(foundItems);
  })
  .catch(err => {
    console.error("Error fetching articles:", err);
    res.status(500).send("Internal server error");
  });

})
.put(function(req, res){
  const originalString = req.params.paramName;
  const modifiedString = _.replace(originalString, /-/g, ' ');
  async function replaceDoc() {
    try {
      await Article.replaceOne({title: modifiedString}, 
        {title: req.body.title, content: req.body.content}
      )
      res.send('Successfully replaced document');
    } catch (error) {
      res.send(error)
      throw error;
    }
  }
  replaceDoc();
})
.patch(function(req, res){
  const originalString = req.params.paramName;
  const modifiedString = _.replace(originalString, /-/g, ' ');
  async function updateDoc() {
    try {
      await Article.updateOne({title: modifiedString}, 
        {title: req.body.title, content: req.body.content}
      )
      res.send('Successfully updated document');
    } catch (error) {
      res.send(error)
      throw error;
    }
  }
  updateDoc();
})
.delete(function(req, res){
  const originalString = req.params.paramName;
  const modifiedString = _.replace(originalString, /-/g, ' ');
  async function deleteDoc() {
    try {
      await Article.deleteOne({title: modifiedString});
      res.send('Successfully deleted document');
    } catch (error) {
      res.send(error)
      throw error;
    }
  }
  deleteDoc();
})

// Starting the server on port 3000 and logging a message to the console
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
