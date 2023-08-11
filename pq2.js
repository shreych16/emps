let express = require("express");
let app = express();
const cors = require("cors");
app.use(express.json());
// app.use(cors)
app.options("*", cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept "
  );
  next();
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const connData = new Client({
  user: "postgres",
  password: "S9301122206y$",
  database: "postgres",
  port: 5432,
  host: "db.mvlmivuheepdfafnklxu.supabase.co",
  ssl: { rejectUnauthorized: false },
});
connData.connect(function (res, error) {
  console.log(`Connected!!!`);
});

app.get("/emps", function (req, res, next) {
    console.log("Inside /emps get api");
    const query = "select * from emps";
    let department = req.query.department;
    let gender = req.query.gender;
    let designation = req.query.designation;
  
    connData.query(query, function (err, result) {
      // console.log(arr1);
      if (err) res.status(404).send(err);
      else {
        if (department) {
          result.rows = result.rows.filter((c1) => c1.department === department);
        }
        if (gender) {
          result.rows = result.rows.filter((st) => st.gender === gender);
        }
        if (designation) {
          result.rows = result.rows.filter(
            (st) => st.designation === designation
          );
        }
  
        res.send(result.rows);
      }
      //connData.end();
    });
  });

  app.post("/emps", function (req, res, next) {
    console.log("Inside post of emps");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into emps(empcode,name,department,designation,salary,gender) values($1,$2,$3,$4,$5,$6)`;
    connData.query(sql, values, function (err, result) {
      console.log(result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    //   connData.end();
    });
  });

  app.put("/emps/:empcode", function (req, res, next) {
    console.log("Inside put of emps");
    let empcode = +req.params.empcode;
    let name = req.body.name;
    let department = req.body.department;
    let designation = req.body.designation;
    let salary = req.body.salary;
    let gender = req.body.salary;
    let values = [name, department, designation, salary, gender, empcode];
    let sql = `update emps set name=$1,department=$2,designation=$3,salary=$4,gender=$5 where empcode=$6`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} updation successful`);
    });
  });

  app.delete("/emps/:empcode", function (req, res, next) {
    console.log("Inside delete of emps");
    let empcode = +req.params.empcode;
    let values = [empcode];
    let sql = `delete from emps where empcode=$1`;
    console.log(empcode);
    connData.query(sql, values, function (err, result) {
      console.log(sql, result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} delete successful`);
    });
  });

  app.get("/emps/:empcode", function (req, res, next) {
    console.log("Inside /emps/:empcode get api");
    let empcode = +req.params.empcode;
    let values = [empcode];
    let sql = `select * from emps where empcode=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  app.get("/resetData", function (req, res) {
    console.log("Inside RestData");
    let sql = "delete from emps";
    connData.query(sql, function (err, result) {
      if (err) res.status(404).send(err);
      else {
        console.log("Successfully deleted.");
        let { empsData } = require("./Task-7 Data.js");
        let arr = empsData.map((p) => [
          p.empcode,
          p.name,
          p.department,
          p.designation,
          p.salary,
          p.gender,
        ]);
        let values = [arr];
        let sql2 = `insert into emps(empcode, name, department, designation, salary, gender) values $1`;
        connData.query(sql2, values, function (err, result) {
          if (err) res.status(404).send(err);
          else {
            console.log(
              "Successfully inserted.");
            let sql3 = "select * from emps";
            connData.query(sql3, function (err, result) {
              if (err) res.status(404).send(err);
              else res.send(result.rows);
            });
          }
        });
      }
    });
  });