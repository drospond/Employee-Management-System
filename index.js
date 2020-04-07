const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

function startInterface(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View employees", "View roles", "View departments", "Add employee", "Add role", "Add department", "Update an employee's role"]
        }
    ]).then((res)=>{
        switch(res.action){
            case "View employees":
                getEmployees();
                break;
            case "View roles":
                getRoles();
                break;
            case "View departments":
                break;
            case "Add employee":
                break;
            case "Add role":
                break;
            case "Add department":
                break;
            case "Update an employee's role":
                break;
            default:
                console.log("invalid input")
                startInterface();
                break;
        }
    })
}

startInterface();

//////
//MySQL queries
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_trackerDB"
})

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected: " + connection.state);
})

function getEmployees(){
    connection.query(`SELECT e1.id, e1.first_name, e1.last_name, departments.department_name, roles.title, roles.salary, concat(e2.first_name, " ", e2.last_name) as manager_name FROM employees e1 LEFT JOIN employees e2 ON e1.manager_id = e2.id JOIN roles ON e1.role_id = roles.id JOIN departments ON departments.id = roles.department_id;`, 
    (err, data)=>{
        if(err) console.log(err);
        console.table(data);
    })
}

function getRoles(){
    connection.query("SELECT roles.title, departments.department_name, roles.salary FROM roles JOIN departments ON departments.id = roles.department_id;",
    (err, data)=>{
        if(err) console.log(err);
        console.table(data);
    })
}

//to figure out:
    //starting interface after table in console
    //creating DB