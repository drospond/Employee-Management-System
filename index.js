const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

function startInterface(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View employees", "View roles", "View departments", "Add employee", "Add role", "Add department", "Update an employee's role", "Quit"]
        }
    ]).then((res)=>{
        switch(res.action){
            case "View employees":
                viewEmployees();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Add role":
                addRole();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Update an employee's role":
                break;
            case "Quit":
                process.exit();
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
    database: "employee_trackerDB",
    multipleStatements: true
})

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected: " + connection.state);
})

function viewEmployees(){
    connection.query(`SELECT e1.id, e1.first_name, e1.last_name, departments.department_name, roles.title, roles.salary, concat(e2.first_name, " ", e2.last_name) as manager_name FROM employees e1 LEFT JOIN employees e2 ON e1.manager_id = e2.id JOIN roles ON e1.role_id = roles.id JOIN departments ON departments.id = roles.department_id;`, 
    (err, data)=>{
        if(err) console.log(err);
        console.table(data);
    })
}

function viewRoles(){
    connection.query("SELECT roles.id, roles.title, departments.department_name, roles.salary FROM roles JOIN departments ON departments.id = roles.department_id;",
    (err, data)=>{
        if(err) console.log(err);
        console.table(data);
    })
}

function viewDepartments(){
    connection.query("SELECT * FROM departments;", (err, data)=>{
        if(err) console.log(err);
        console.table(data);
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the new department?"
        }
    ]).then((res)=>connection.query(`INSERT INTO departments(department_name) VALUE (?);`, res.department));
}

function addRole(){
    connection.query(`SELECT department_name, id FROM departments;`, (err, data)=>{
        if(err) console.log(err);
        departmentsArray = data.map(row=> row.department_name);
        inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the new role?"
            },
            {
                type: "list",
                name: "department",
                message: "What department is the role in?",
                choices: departmentsArray
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?"
            }
        ]).then((res)=>{
            const departmentId = data.filter(row => row.department_name === res.department);
            connection.query("INSERT INTO roles(title, salary, department_id) VALUE (?,?,?)",[res.role, Number(res.salary),departmentId[0].id]);
        })
    })
}

function addEmployee(){
    connection.query(`SELECT department_name, id FROM departments;
    SELECT id, title FROM roles;
    SELECT id, concat(first_name, " ", last_name) as name, role_id FROM employees;`, (err, res)=>{
        if(err) console.log(err);
        const rolesArray = res[1].map(row => row.title);
        let managerId;
        for(var i = 0; i < res[1].length; i++){
            if(res[1][i].title === "Manager") managerId = res[1][i].id;
        }
        const managerArray = res[2].filter(row => row.role_id === managerId).map(row => row.name);
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the first name of the new employee?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the last name of the new employee?"
            },
            {
                type: "list",
                name: "role",
                message: "What is their role?",
                choices: rolesArray
            },
            {
                type: "list",
                name: "manager",
                message: "Who is their manager?",
                choices: managerArray
            }
        ]).then((response)=>{
            const roleId = res[1].filter(row => row.title === response.role);
            const managerId = res[2].filter(row => row.name === response.manager);
            connection.query("INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)",[response.firstName, response.lastName, roleId[0].id, managerId[0].id]);
        })
    })
}
//to figure out:
    //starting interface after table in console
    //creating DB