const mysql = require("mysql");
const inquirer = require("inquirer");

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
                break;
            case "View roles":
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
        }
    })
}

startInterface();