"use strict";
const fetch = require("node-fetch");
const path = require("path");

const appRouter = app => {

  app.get("/", function(req, res) {
    res.status(200).sendFile("index.html");
  });

  app.get("/users", (req, res) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => res.status(200).send(data));
  });

  app.get("/:userId/album",(req,res)=>{
    const { userId } = req.params
    fetch("https://jsonplaceholder.typicode.com/albums?userId="+userId)
      .then(response => response.json())
      .then(data => res.status(200).send(data));
  })

  app.get("/:userId/album/:albumId",(req,res)=>{
    const { userId, albumId } = req.params
    console.log(req.params)
    fetch("https://jsonplaceholder.typicode.com/photos?albumId="+albumId)
      .then(response => response.json())
      .then(data => res.status(200).send(data));
  })

  app.get("/:userId/album/:albumId",(req,res)=>{
    const { userId, albumId } = req.params
    console.log(req.params)
    fetch("https://jsonplaceholder.typicode.com/photos?albumId="+albumId)
      .then(response => response.json())
      .then(data => res.status(200).send(data));
  })
};

module.exports = appRouter;
