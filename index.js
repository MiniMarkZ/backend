const express = require("express");
const cors = require("cors");
const corsOptions ={ origin:'*'}
const app = express();
const PORT = process.env.PORT || 5000 ;
const fs = require('fs');
var path = require('path');
const csv = require('csv-parser');
const { log } = require("console");
app.use(cors(corsOptions))

  app.get('/csv/*', function(req, res){
    var origin = req.params
    res.download(`./projectdata/csv/${origin[0]}`) ;
  });

 /*--------------- */

  app.get('/downloaddcm/*', function(req, res){
    var origin = req.params;
    res.download(`projectdata/${origin[0]}`) ;
  });

  /*--------------- */

  app.get('/test',(req,res)=>{
    make_dir('projectdata','').then((e)=>{
    res.send(e);
  })
});

make_dir = async(pathname, keyorigin) => {
  var key = await new Promise((resolve, reject) => {
      fs.readdir(pathname, (error,files) => {
          resolve(files)
      })
  })
  var tmp_arr = [];
  for(let i=0 ;i<key.length;i++){
      if (!key[i].includes('.dcm') && !key[i].includes('.csv')){
          var obj = {};
          obj['label'] = key[i];
          var tmp_key = keyorigin + '-' + i;
          if(keyorigin === ''){
              tmp_key =  i.toString();
          }
          obj[`key`] = tmp_key
          var nodes = await make_dir(pathname + '/' + key[i], tmp_key)
          //console.log(nodes);
          obj[`nodes`] = nodes
          tmp_arr.push(obj)
          if(i==key.length-1){
              return tmp_arr
          }
      }
      else{
          var obj = {};
          obj[`label`] = key[i];
          obj[`key`] = keyorigin + '-' + i
          obj[`isOpen`] = false;
          obj[`path`] = pathname + '/' + key[i];
          tmp_arr.push(obj);
      }
  }
  return tmp_arr
} 

 /*--------------- */

app.get('/csvdata/*',async function(req, res){
  var origin = req.params;
  const results = [];
  fs.createReadStream(`./projectdata/csv/${origin[0]}`)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    arry = [] ;
    for(let i=0 ; i<results.length ; i++){
      var obj = {};
      obj = results[i]
      obj[`key`] = `${i}`;
      arry.push(obj);
    }
    res.send(arry)
  });
});

 /*--------------- */

app.listen(PORT, ()=> console.log(`server is ${PORT}`));