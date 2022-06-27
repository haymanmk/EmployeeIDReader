const express = require('express');
let app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

let CardID = '0006771993';

app.get('/', (req, res) => {
  QueryEmployeeInfo(CardID)
  .then(result=>{
    console.log(result);
    const EmpID = result.Payload.EmpID;
    const ENAME = result.Payload.ENAME;
    const EmpName = result.Payload.EmpName;
    const SWNAMC = result.Payload.SWNAMC;
    res.render('index', {
      EmployeeIMG: `http://10.128.0.10/engineers/images/${EmpID}.jpg`,
      EmployeeID: EmpID,
      EmployeeNameEng: ENAME,
      EmployeeNameCht: EmpName,
      EmployeeSector: SWNAMC,
    });
  }
  ).catch(err=>{
    console.log(`Error occurred: ${err}`);
  }
  );
  console.log('webpage rendered');
});

app.post('/api', (req, res) => {
  console.log(req);
  CardID = req.body.CardID;
  res.redirect('/');
});

let port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function QueryEmployeeInfo(CardID) {
  return new Promise((resolve, reject) => {
    axios.get(`http://peweb/home/LineControllerWebAPI/api/FlowController/Man/GetGarminEmployee/${CardID}`
    ).then((response) => {
      console.log("Send request to GARMIN web api....");
      console.log(response.data.Payload.EmpID);
      console.log(response.data);
      resolve(response.data);
    }).catch((msg) => {
      console.log("Error No.: " + msg);
      console.log(msg.code);
      reject(msg);
    });
  });
}