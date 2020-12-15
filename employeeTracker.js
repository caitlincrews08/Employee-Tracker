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
connection.connect(function (err) {
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
      "Exit"
    ]
  }).then(function (res) {
    switch (res.start) {
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

      case "Exit":
        console.log("thanks for using employee tracker!");
        process.exit();
        break;
    }
  });
}

// function that creates a new department and inserts into db table
function addDept() {
  inquirer.prompt({
    name: "newDept",
    type: "input",
    message: "Please enter a name for the new department."
  }).then(function (answer) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.newDept,
      },
      function (err) {
        if (err) throw err;
        console.log("Your new department was created successfully!");
        init();
      }
    );
  });
}


// function runs when user selects add role from array
function addRole() {
  // captures department choices from db and corresponding IDs
  let deptChoices = [];
  let deptID = {};

  availableDepts();

  const questions = [
    {
      name: "title",
      type: "input",
      message: "What is the title of the new role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of this position?"
    },
    {
      name: "dept",
      type: "list",
      message: "What department does this position belong to?",
      choices: deptChoices
    }
  ] 

  // gets array of departments from database
 function availableDepts() {
  let sql = "SELECT * FROM department";
  connection.query(sql, async function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      // push department 'name' response from db to deptChoices array
      deptChoices.push(res[i].name);
      // finds corresponding ID from db and sets it as 'deptID'
      deptID[res[i].name] = res[i].id;
    }
    return deptChoices;
  });
}
 
  inquirer.prompt(questions).then(function(answer) {
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: answer.title,
        salary: answer.salary,
        department_id: deptID[answer.dept]
      },
      function (err) {
        if (err) throw err;
        console.log("Your new role was added successfully!");
        init();
      }
    );
  });
};

// function runs when user selects add employee
function addEmp() {
  // holds role options available from db
  let roleChoices = [];
  let roleID = {};
  // holds manager options available from db
  let managerChoices = ["None"];
  let managerID = {};

  availableRoles();
  availableManagers();

  const questions = [
    {
      name: "firstName",
      type: "input",
      message: "Please enter the employee's first name."
    },
    {
      name: "lastName",
      type: "input",
      message: "Please enter the employee's last name."
    },
    {
      name: "role",
      type: "list",
      message: "What is this employee's role?",
      choices: roleChoices
    },
    {
      name: "manager",
      type: "list",
      message: "Select this employee's manager.",
      choices: managerChoices

    }
  ]

  function availableRoles() {
    let sql = "SELECT * FROM role";
    connection.query(sql, function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        // push role 'title' response from db to roleChoices array
        roleChoices.push(res[i].title);
        // finds corresponding ID from db and sets it as 'roleID'
        roleID[res[i].title] = res[i].id;
      }
      return roleChoices;
    });
  }

  function availableManagers() {
    let sql = "SELECT * FROM employee";
    connection.query(sql, function(err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        // push first and last name of employees in db to managerChoices array
        managerChoices.push(res[i].first_name + ' ' + res[i].last_name)
        // this should set the manager id = to 
        managerID[res[i].first_name + ' ' + res[i].last_name] = res[i].id;
      };
      return managerChoices;
    })
  }

  inquirer.prompt(questions).then(function(answer) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: roleID[answer.role],
        manager_id: managerID[answer.manager]
      },
      function (err) {
        if (err) throw err;
        console.log("Your new employee was added successfully!");
        init();
      }
    );
  });
};