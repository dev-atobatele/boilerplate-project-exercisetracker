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
function getUser(_id) {
  for (const user of users) {
    if (user._id==_id) {
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
  let body = req.body.username;
  let User = {
    username: body.slice(0,body.lastIndexOf('_')),
    _id: body.slice(body.lastIndexOf('_')+1),
  };
  //console.log(user);
  res.json(User);
  users.push(User);
});

app.post('/api/users/:_id/exercises',
function postExcercise(req,res) {
  let body = req.body;
  let {_id} = req.params;
  let user = getUser(_id);
  let Exercise = {
    ...user,
    description:body.description,
    duration:Number(body.duration),
    date:new Date(body.date).toDateString()
  };
  if (!body.date) {
    Exercise.date = new Date().toDateString();
  };
  if (!user.exs) {
    user.exs = [];
  };
  user.exs.push(Exercise);
  //console.log(Exercise);
  res.send(Exercise);
});

app.get('/api/users/:_id/logs',
function getLogs(req,res){
  let {_id} = req.params;
  let user = getUser(_id);
  //console.log(user)
  let Log = {
    ...user,
    count:user.exs.length,
    log:user.exs
  };
  //console.log(Log);
  res.send(Log);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
