
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
    username: `${req.body.username}`,
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
  console.log(user);
  res.json(user);
});

app.get('/api/users/:_id/logs',
function getLogs(req,res){
  let {_id} = req.params;
  let user = getUser(_id);
  let logs = {
    count : user.excercises.length,
    log : user.excercises
  }
  console.log(logs);
  res.json(logs);
});
