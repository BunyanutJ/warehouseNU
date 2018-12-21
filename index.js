const express = require('express');
const app = express(); // use function in express
const port = 3000; // custom port
const bodyParser = require('body-parser');// user html body
const cors = require('cors');
const path = require('path');
const md5 = require('md5');
const ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
// var format = require('util').format;
const mongoserver = 'ds141654.mlab.com:41654/';
const mongoDB = 'warehouse';
const mongouserpass = 'BunyanutJ:bbf832BBF832';
let fullmongodbURL = 'mongodb://'+mongouserpass+'@'+mongoserver+mongoDB;
// db.registeration.insert();
//mongo mongodb://BunyanutJ:bbf832BBF832@ds141654.mlab.com:41654/warehouse

// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
//   }));

// app.use(express.static('assets/html'));
app.use(bodyParser.json()); // create json body html
app.use(bodyParser.urlencoded({ extended: true })); // create json form to send data
app.use('/css',express.static(path.join(__dirname, 'assets/css')));
app.use('/js',express.static(path.join(__dirname, 'assets/js')));


app.listen(port, () => console.log('Web Api running on port \nhttp://127.0.0.1:'+port));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/login.html'));
});

app.post('/login',(req,res)=>{
    let mergemd5 = md5(req.body.user)+md5(req.body.pass);
    mergemd5 = md5(mergemd5);
    let keyslot = '{"username" : "'+req.body.user + '","password" : "'+req.body.pass+'","key" : "'+mergemd5+'"}';
    // console.log(keyslot);
    keyslot = JSON.parse(keyslot);
    // console.log(keyslot);
    // res.send(keyslot);
    MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
        if(err) throw err;
        else{
            let db = client.db().collection('registeration');
            // db.insert(keyslot);
            db.find(keyslot).toArray(function(err,result){
                if(err) throw err;
                else{
                    let new_result = JSON.stringify(result);
                    console.log(new_result);
                    // res.send(new_result);
                    if(new_result=="[]"){
                        console.log("not found");
                        // res.send("not found");
                    }
                    else{
                        res.sendFile(path.join(__dirname + '/assets/html/index.html'));
                        // res.send(new_result);
                    }
                }
            });
            
        }
        client.close();
    })
});

app.get('/registeration',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/registeration.html'));
});

app.post('/registeration',(req,res)=>{
    let mergemd5 = md5(req.body.user)+md5(req.body.pass);
    mergemd5 = md5(mergemd5);
    let keyslot = '{"username" : "'+req.body.user + '","password" : "'+req.body.pass+'","key" : "'+mergemd5+'"}';
    // console.log(keyslot);
    keyslot = JSON.parse(keyslot);
    // console.log(keyslot);
    // res.send(keyslot);
    MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
        if(err) throw err;
        else{
            let db = client.db().collection('registeration');
            // db.insert(keyslot);
            db.find(keyslot).toArray(function(err,result){
                if(err) throw err;
                else{
                    let new_result = JSON.stringify(result);
                    console.log(new_result);
                    // res.send(new_result);
                    if(new_result=="[]"){
                        db.insertOne(keyslot);
                        console.log("register complete");
                        res.send("register complete");
                    }
                    else{
                        console.log("username or password is already exists");
                        res.send("username or password is already exists");
                    }
                }
            });
            
        }
        client.close();
    })
});

app.get('/index.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/index.html'));
});

app.get('/inventory/:order',(req,res)=>{
    // res.send("Hello World"+req.params.order);
    if(req.params.order == "all"){
        MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
            if(err) throw err;
            else{
                let db = client.db().collection('inventory'); 
                db.find({},{fields:{_id: 0}}).toArray(function(err,result){
                    if(err) throw err;
                    else{
                        let new_result = JSON.stringify(result);
                        console.log(new_result);
                        new_result = JSON.parse(new_result);
                        res.send(new_result);
                    }
                })
            }
            client.close();
        });
    }
    else{
        // MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
        //     if(err) throw err;
        //     else{
        //         let db = client.db().collection('inventory'); 
        //         db.findOne({"salmon":{$exists:true}}).toArray(function(err,result){
        //             if(err) throw err;
        //             else{
        //                 let new_result = JSON.stringify(result);
        //                 console.log(new_result);
        //                 new_result = JSON.parse(new_result);
        //                 res.send(new_result);
        //             }
        //         })
        //     }
        //     client.close();
        // });
        MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
            if(err) throw err;
            else{
                let db = client.db().collection('inventory'); 
                db.findOne({"salmon":{$exists:true}},{fields:{_id: 0}},function(err,result){
                    if(err) throw err;
                    else{
                        let new_result = JSON.stringify(result);
                        console.log(new_result);
                        new_result = JSON.parse(new_result);
                        res.json(new_result);
                    }
                })
            }
            client.close();
        });
        // res.send("find one");
    }
});

app.get('/detail.html',(req,res)=>{
    // let name = "hello World";
    res.sendFile(path.join(__dirname + '/assets/html/detail.html'));
    // res.render(__dirname + "/assets/html/detail.html", {name:name});
});

app.get('/get/detail/:order',(req,res)=>{
    MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
        if(err) throw err;
        else{
            let db = client.db().collection('inventory'); 
            db.find({'name':req.params.order},{fields:{_id: 0}}).toArray(function(err,result){
                if(err) throw err;
                else{
                    let new_result = JSON.stringify(result);
                    console.log(new_result);
                    new_result = JSON.parse(new_result);
                    res.send(new_result);
                }
            })
        }
        client.close();
    });
    
});

app.get('/addW.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/addW.html'));
});

app.get('/detailW.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/detailW.html'));
});

app.get('/outbound.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/outbound.html'));
});

app.get('/receipt.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/receipt.html'));
});

app.get('/export.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/export.html'));
});

app.get('/inbound.html',(req,res)=>{
    res.sendFile(path.join(__dirname + '/assets/html/inbound.html'));
});


// MongoClient.connect(fullmongodbURL,{ useNewUrlParser: true },function(err,client){
//     if(err){
//         throw err;
//     }
//     else{
//         var db = client.db().collection('inventory');

//         db.insert([
//             {
//                 "detail":{
//                             "category":"fresh",
//                             "name":"apple",
//                             "length":"10M",
//                             "width":"5M",
//                             "height":"2M",
//                             "weight":"20kg",
//                             "price":"baht",
//                             "company":""
//                         },
//                 "id":"",
//                 "name":"apple",
//                 "warehousename":"fresh warehouse",
//                 "zone":"a",
//                 "row":1,
//                 "colum":3,
//                 "exp":"11/03/66"
//             },
//             {
//                 "detail":{
//                             "category":"fresh",
//                             "name":"salmon",
//                             "length":"10M",
//                             "width":"5M",
//                             "height":"2M",
//                             "weight":"20kg",
//                             "price":"baht",
//                             "company":""
//                         },
//                 "id":"",
//                 "name":"salmon",
//                 "warehousename":"fresh warehouse",
//                 "zone":"a",
//                 "row":1,
//                 "colum":3,
//                 "exp":"11/03/66"
//             }
//     ]);
  
//         db.find().toArray(function (err, result) {
//             if (err) throw err

//             console.log(result)

//         })
//         console.log("connected");
//     }
//     client.close();
// })

