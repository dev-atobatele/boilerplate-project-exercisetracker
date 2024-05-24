const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({
  extended:false
}));
app.use(bodyParser.json());

let users = [];
let id = 1;
function getUser(id) {
  for (const user of users) {
    if (user._id==id) {
      return user;
    }
  }
};

app.route('/api/users')
.get(function getUsers(req,res) {
  //console.log(users);
  res.json(users);
})
.post(function postUser(req,res) {
  let user = {
    username: req.body.username,
    _id:`${id}`,
    excercises:[]
  };
  //console.log(user);
  res.json(user);
  id+=1;
  users.push(user);
});

app.post('/api/users/:_id/exercises',
function postExcercise(req,res) {
  let body = req.body;
  let {_id} = req.params;
  let user = getUser(_id);
  let excercise = {
    description:body.description,
    duration:Number(body.duration),
    date:new Date(body.date).toDateString()
  };
  if (!body.date) {
    excercise.date = new Date().toDateString();
  };
  user.excercises.push(excercise);
  //console.log(user);
  res.send(user);
});

app.get('/api/users/:_id/logs',
function getLogs(req,res){
  let {_id} = req.params;
  let user = getUser(_id);
  let exs = user.excercises;

  let logs = {
    log:exs
  };

  let {from,to} = req.query;
  let fromArr=[];
  let toArr=[];

  if (from) {
    for (const ex of exs) {
      if (new Date(ex.date) > new Date(from)) {
        fromArr.push(ex);
      }
    }
  };
  if (to) {
    for (const ex of exs) {
      if (new Date(ex.date) < new Date(to)) {
        toArr.push(ex);
      }
    }
  };
  let filteredLog = fromArr.concat(toArr);
  if (filteredLog.length>0) {
    logs.log = filteredLog
  };
  logs.count = logs.log.length;
  
  console.log(logs);
  res.send(logs);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
