var uuid = require('node-uuid');
var request = require('request'); 
var j = request.jar()
var request = request.defaults({jar:j})


var g_isLogin = false;
var g_token = '';

var _config = {
    'username':'',
    'password':''
}

function config(c)
{
    _config = c;
}



function Login(username, password, callback)
{
    var options = {
            method: 'POST',
            url: 'https://api.pomotodo.com/actions/account/login',
            json:true,
            body: {"username": username ,"password": password , "device":"chrome"}
    };

    request(options, function (error, response, body) {
      if (error) {
          callback(error, null);
          return;
      }
      callback(null, body.data.token);
    });
}

function Sync()
{
    var timeLastSync=Date.now()/1000;
    var options = { 
        method: 'POST',
        url: 'https://api.pomotodo.com/actions/account/sync',
        headers: 
        {
         'content-type': 'application/json;charset=UTF-8',
         'x-lego-token': g_token 
        },
        json:true,
        //body: {"data":{"objects":{"pomos":{},"todoes":{},"todo_order":{"order":[],"updated_at":timeLastSync}},"last_sync":''+timeLastSync}}//end of body
        body : {"data":{"objects":{"pomos":{},"todoes":{},"todo_order":{}},"fast_sync":604800}}
    };// end of options
    
    request(options, function (error, response, body) {
      if (error) {
          console.log('sync err:' + error);
          return;
      }
      //console.log('sync finish.');
    });
}

function DoAddTask(task, callback)
{
    var newID = uuid.v4();
    var timeLastSync=Date.now()/1000;
    
    var todos ={};
    todos[newID] = {
        //"uuid": newID,
        //"id": null,
        "description": task,
        "updated_at": timeLastSync,
        //"sync_status": 0,
        "created_at": timeLastSync,
        //"deleted": false,
        //"completed": false,
        //"pin": false,
        //"parent_uuid": null,
        //"estimated_pomos": null,
        //"pomo_costed": 0,
        //"remind_time": null,
        //"repeat_type": "none",
        //"notice": null,
        //"cleaned": 0
    };
    
    var options = { 
        method: 'POST',
        url: 'https://api.pomotodo.com/actions/account/sync',
        headers: 
        {
         'content-type': 'application/json;charset=UTF-8',
         'x-lego-token': g_token 
        },
        json:true,
        body: {
            "data": {
                "objects": {
                    "pomos": {},
                    "todoes": todos
                },
                "last_sync": '' + timeLastSync
            }
        }//end of body
    };// end of options
    request(options, function (error, response, body) {
      if (error) {
          callback(error, task);
          return;
      }
      callback(null, task);
    });

}

function AddTask (task, callback)
{
    if(!g_isLogin)
    {
        Login(_config.username, _config.password, function(err, token)
            {
                if(err){
                    callback(err, task);
                    return;
                }
                g_token = token;
                g_isLogin = true;
                AddTask(task, callback);
                console.log('login success');
                setInterval(function() {
                    Sync();
                }, 3000);

            });
        return;
    }
    DoAddTask(task, callback);
}

exports.config=config
exports.addtask=AddTask