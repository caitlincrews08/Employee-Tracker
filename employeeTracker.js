const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Ghost08.",
  database: "employeetracker_db"
});

// establishes connection to server
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
});

// prompts user with questions from command line then routes user to proper function below
function init() {
  inquirer.prompt({
    name: "start",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "Add a department",
      "Add a role",
      "Add an employee",
      "View departments",
      "View roles",
      "View employees",
      "Update employee roles",
      "Nothing"
    ]
  }).then(function(res) {
    switch (res.action) {
      case "Add a department":
        addDept();
        break;

      case "Add a role":
        addRole();
        break;

      case "Add an employee":
        addEmp();
        break;
        
      case "View departments":
        viewDept();
        break;

      case "View roles":
        viewRoles();
        break;

      case "View employees":
        viewEmps();
        break;

      case "Update employee roles":
        updateRole();
        break;

      case "Nothing":
        endConnection();
        break;
    }
  });
}

// why isnt this working??
function endConnection() {
  console.log("thanks for using employee tracker!")
  connection.end();
}

// why didnt this work either :(((
function addDept() {
  inquirer.prompt({
    name: "newDept",
    type: "input",
    message: "Please enter a name for the new department."
  }).then(function(answer) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.newDept,
      },
      function(err) {
        if (err) throw err;
        console.log("Your new department was created successfully!");
        init();
      }
    );
  });
}