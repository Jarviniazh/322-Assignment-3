const legoData = require("./modules/legoSets");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');

// mark the "public" folder as "static"
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public')); //Vercel

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get("/lego/sets", async (req,res)=>{
  try{

    if(req.query.theme){
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.send(sets);
    }
    else{
      let sets = await legoData.getAllSets();
      res.send(sets);
    }
  }catch(err){
    res.status(404).send(err);
  }
});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.send(set);
  }catch(err){
    res.status(404).send(err);
  }
});

// app.get("/lego/sets/theme-demo", async (req,res)=>{
//   try{
//     let sets = await legoData.getSetsByTheme("tech");
//     res.send(sets);
//   }catch(err){
//     res.send(err);
//   }
// });

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"))
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

