var request = require('request'); 

var _config = {
    'token':''
}

function config(c)
{
    _config = c;
}


function AddTask (task, callback)
{
	var options = { 
        method: 'POST',
        url: 'https://api.pomotodo.com/1/todos',
        headers: 
        {
         'content-type': 'application/json;charset=UTF-8',
         'Authorization': 'token ' + _config.token 
        },
        json:true,
        body: {
            "description": task
        }//end of body
    };// end of options
	console.log('task:'+task)
    request(options, function (error, response, body) {
      if (error) {
          callback(error, task);
          return;
      }
      callback(null, task);
    });
}

exports.config=config
exports.addtask=AddTask