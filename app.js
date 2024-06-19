const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const User = require("./models/customerSchema"); // user is "UserSchema" from the structure
app.set("view engine", "ejs");
app.use(express.static("public"));
var moment = require("moment");

var methodOverride = require('method-override') // possibility to delete
app.use(methodOverride('_method'));


// Auto refresh(not included yet)
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// GET Requestj
app.get("/", (req, res) => {

  User.find()
    .then((result) => { 
     
        res.render("index", {arr: result, moment: moment}); // arr is result and result is the data in mongoose. 

    })
    .catch((err) => { 
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", (req, res) => {

  User.findById(req.params.id)
  .then((result) => { 
    res.render("user/edit", {obj: result, moment : moment});
  })
  .catch((err) => {
    console.log(err);
  });

});


app.get("/view/:id", (req, res) => {
  
  // result ==> object
  User.findById(req.params.id)    // to get only one single object
    .then((result) => { 
      res.render("user/view", {obj: result, moment : moment});
    })
    .catch((err) => {
      console.log(err);
    });

});


// POST Request
app.post("/user/add.html", (req, res) => {
 
    User.create(req.body)   // ==> we can use save() instead of create()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });

});

app.post("/search", (req, res) => {

  const search = req.body.search.trim();
 
  User.find( {$or: [{ firename: search }, {lastName : search }]} )  

  .then((result) => {
    
    res.render("user/search", {arr: result, moment : moment});
    console.log(result)

  })
  .catch((err) => {
    console.log(err);
  });

});

// Delete Request
app.delete("/edit/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(() => { 
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// update the user info
app.put("/edit/:id", (req, res) => {
  // console.log(req.body)

  User.updateOne({ _id : req.params.id }, req.body) // must give key and value or use findByAndUpdate
  
  .then((result) => {

    res.redirect("/");

  })
  
  .catch((err) => {
    console.log(err)
  });

});

mongoose
  .connect(
    "mongodb+srv://ebryassine:rzk3K2c32vBv7URL@cluster0.ovhimcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });