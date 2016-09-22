var express = require('express');
var bodyParser = require('body-parser');
var pmto = require("./pomotodo-sync");
var fs = require("fs");
var app = express(); 
// create application/json parser
var jsonParser = bodyParser.json()

app.use(jsonParser);

var pmtoCfg = {
  'token':process.env.POMOTODO_TOKEN
};
pmto.config(pmtoCfg);

var TOWER_USERNAME = process.env.TOWER_USERNAME;


var appConfig = null;
fs.readFile(__dirname + '/config.json', function(err, fileContent){  
  if (err) {
    console.log('Read config Error: ' + err);
  } else {
    appConfig = JSON.parse(fileContent);
  }
});



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
  projectName = TowerNameMapping('project',projectName);
  todolistName = TowerNameMapping('tasklist',todolistName);

  var task = '#' + projectName;
  if(todolistName != "未归类任务")
  {
    task += ' #' + todolistName;
  }
  task += ' ' + taskTitle;
  console.log(action + ' : ' + taskUser+ ' : '+ task );
  console.log('taskUser:'+taskUser +　', TOWER_USERNAME:' + TOWER_USERNAME + '  eq:' + (taskUser == TOWER_USERNAME))
  if((action == 'created' || action=='assigned')&& taskUser == TOWER_USERNAME)
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


app.get('/', function(req, res){ 
  res.send('hello'); 
}); 


app.get('/addtask', function(req, res){ 
  
  var task = req.query.task;
  if(!task)
  {
    res.send('task not given'); 
    return;
  }
     pmto.addtask(task,function(err, task){
    if(err)
    {
      console.log('add task err:' + err);
      res.send('add task err:' + err); 
    }
    else
    {
      console.log('add task ok:' + task);
      res.send('add task ok:' + task);
    }
   });
}); 


// NameMapping
var TowerNameMapping = function(nametype, raw_name){
  if(appConfig && appConfig['tower_name_mapping']){
    if(appConfig['tower_name_mapping'][nametype]){
      if(appConfig['tower_name_mapping'][nametype][raw_name]){
        return appConfig['tower_name_mapping'][nametype][raw_name];
      }      
    }
  }
  return raw_name;
}

var myPort = process.env.PORT || 3001;

app.listen(myPort);
console.log('listen at: ' + myPort);
