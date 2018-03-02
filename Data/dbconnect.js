const {MongoClient, ObjectID} = require('mongodb');
const yargs=require('yargs');
const fs = require('fs');
var cmd=yargs.argv._[0];
var value=yargs.argv;
var dbb="",dbc="";
function add(){
  var obj={_id:value.rno||null, name:value.name||null, role: value.role||null};
  if(!obj.role)
    obj.role="Student";
  if(!(obj._id&&obj.name))
    throw "Invalid add!";
  dbc.insertOne(obj,(err,res)=>{
    if(err) throw err;
    console.log("Inserted "+JSON.stringify(res));
  });
}
function list()
{
  var docs=dbc.find().toArray().then((res)=>{
      console.log(res);
  },(err)=>{
    throw err;
  });
}
function find() {
  var obj={};
  if(value.rno)
    obj._id=value.rno;
  if(value.name)
    obj.name=value.name;
  if(value.role)
    obj.role=value.role;
    var result="";
    dbc.find(obj).toArray().then((res)=>{
        console.log(res);
      },(err)=>{
        throw err;
      }
    );
}
MongoClient.connect("mongodb://localhost:27017" , (err,db)=>{
  if(err) throw err;
    dbb=db.db(value.year||"3rd");
    dbc=dbb.collection(value.section||"CSE-2");
  if(cmd==="add")
  {
    add();
  }
  else if(cmd=="list"){
      list();
  }
  else if(cmd=="find"){
    find();
  }
  else if(cmd=="delete"){
    if(value._[1]=="all"&&value._[2]=="MSERARNA_CBIT")
    {
        dbc.drop((err,res)=>{
            console.log(res);
        })
    }
    else if(value._[1]=="one")
    {
      var obj={};
      if(value.rno)
        obj._id=value.rno;
      if(value.name)
        obj.name=value.name;
      if(value.role)
        obj.role=value.role;
      // find();
      dbc.findOneAndDelete(obj).then((res)=>{
        console.log("Deleted "+JSON.stringify(res.value));
      });
    }
  }
  db.close();
  });
