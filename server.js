var express = require('express');
var bodyParser = require('body-parser');
var pmto = require("./pomotodo-sync");
var app = express(); 
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);

var pmtoCfg = {
  'username':process.env.POMOTODO_USERNAME,
  'password':process.env.POMOTODO_PASSWORD
};
pmto.config(pmtoCfg);


app.post('/towerhookhandler', jsonParser, function(req, res){ 
  res.send('add'); 
  //console.log(req.body)
  var action = req.body.action;
  var data = req.body.data;
  var projectName = data.project.name;
  var todolistName = data.todolist.title;
  var taskTitle = data.todo.title;
  var taskUser = '';
  if(data.todo.assignee)
  {
    taskUser = data.todo.assignee.nickname
  };
  var task = '#' + projectName;
  if(todolistName != "未归类任务")
  {
    task += ' #' + todolistName;
  }
  task += ' ' + taskTitle;
  console.log(action + ' : ' + taskUser+ ' : '+ task );
  if((action == 'created' || action=='assigned')&& taskUser == 'liangxh_test')
  {
   pmto.addtask(task,function(err, task){
    if(err)
    {
      console.log('add task err:' + err);
    }
    else
    {
      console.log('add task ok:' + task);
    }
   });
  }
  
}); 


app.post('/add', jsonParser, function(req, res){ 
  pmto.addtask(req.body.task,function(err, task){
    if(err)
    {
      res.send('add task err:' + err);
    }
    else
    {
      res.send('add task ok:' + task);
    }
  })
}); 

app.get('/', function(req, res){ 
  res.send('hello'); 
}); 

var myPort = process.env.PORT || 3001;

app.listen(myPort);
console.log('listen at: ' + myPort);
