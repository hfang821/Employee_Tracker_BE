//require npm packages
const inquirer = require('inquirer');
const db = require('./db/connection');
const table = require('console.table');
const connection = require('./db/connection');
const dbMethods = require("./db/index.js");

const userPrompt = () => {
    inquirer.prompt({
        type: 'list',
        name: 'options',
        message: 'Select a option to proceed',
        choices: ['View Employees', 'View Roles', 'View Departments', 'Add an Employee', 'Add a Role', 'Add a department', "Update employee's role", "I'm done."]
    })
        //ask TA: why should I use async and await? and if I do, should I keep my other functions asynchronous?
        //Answer is no, because sql queries are asynchronous, which means it is like a api fetch, which takes time (no idea how long it will take).
        //await should always be in a async function.
        //.then is interchangeable with async/await
        .then(async (data) => {
            switch (data.options) {
                case 'View Employees':
                    await viewEmployees();
                    break;
                case 'View Roles':
                    await viewRoles();
                    break;
                case 'View Departments':
                    await viewDepartments();
                    break;
                case 'Add an Employee':
                    await addEmployee();
                    break;
                case 'Add a Role':
                    await addRole();
                    break;
                case 'Add a department':
                    await addDepartment();
                    break;
                case "Update employee's role":
                    await updateRole();
                    break;
                /*
                default:
                    console.log("exiting...");
                    connection.end();
                */
            }
        });
};

const followUp = () => {
    inquirer.prompt([
        {
            name: "followup",
            type: "confirm",
            message: "Do you want to return to the main menu?"
        }
    ]).then(answer => {
        if (answer.followup === true) {
            userPrompt();
        } else {
            console.log('You have exited the program.');
            connection.end();
        }
    })
}

//async method
//ask TA: which one to use?
const viewEmployees = async () => {
    const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager on manager.id = employee.manager_id
    `;
    //how should I join the manager id in here?
    //how can I properly use the promise function?
    try {
        const result = await db.promise().query(sql)
        const [rows, fields] = result;
        const showTable = table.getTable(rows);
        console.log(showTable);
        followUp();
    } catch (error) {
        console.log(error);
    }
    //db.promise().query(sql)
    // .then(([rows,fields])=>{

    // })
    //.catch(err =>console.log(err));
}

//sync method
const viewRoles = () => {
    const sql = `SELECT * FROM role;`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const showTable = table.getTable(result);
        console.log(showTable);
        return showTable;
    })
}

const viewDepartments = () => {
    const sql = `SELECT * FROM department;`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const showTable = table.getTable(result);
        console.log(showTable);
    })
}

const addEmployee = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name. (required)",
            validate: firstName => {
                if (firstName) {
                    return true;
                }
                console.log("You need to enter a first name");
                return false;
            }
        },

        {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name. (required)",
            validate: lastName => {
                if (lastName) {
                    return true;
                }
                console.log("You need to enter a last name");
                return false;
            }
        }
    ])
        .then((answer) => {
            let firstName = answer.first_name;
            let lastName = answer.last_name;

            dbMethods.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }))

                    console.log("roleChoices", roleChoices)

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's role?",
                            choices: roleChoices
                        },
                    ])
                        .then((answer) => {
                            let roleId = answer.role

                            dbMethods.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const employeeChoices = employees.map(({ first_name, last_name, id }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }))

                                    inquirer.prompt([
                                        {
                                            type: 'list',
                                            name: 'manager',
                                            message: "Who is the employee's manager?",
                                            choices: employeeChoices
                                        }
                                    ])
                                        .then((answer) => {
                                            let employee = {
                                                first_name: firstName,
                                                last_name: lastName,
                                                role_id: roleId,
                                                manager_id: answer.manager
                                            }

                                            dbMethods.addEmployee(employee)
                                                .then(() => console.log(`Added ${employee.first_name} ${employee.last_name} to the database!`))
                                                .then(() => followUp())
                                        })
                                })
                        })
                })

        })

    // .then(data =>{
    //     //ask TA: how do I connect the role to a role id? && the manager name to a id
    //     console.log("data",data)
    //     const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    //     VALUES (data.first_name, data.last_name, ,);`;
    //     db.query(sql,(err, result) =>{
    //         if (err) throw err;
    //         console.log(`${data.firstName} ${data.lastName} has been added as a ${data.role}`);
    //         followUp();
    //     })
    // })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
            validate: departmentName => {
                if (departmentName) return true;
                else {
                    console.log("You need to enter the name of the department!");
                    return false;
                }
            }
        }
    ]).then(data => {
        const sql = `INSERT INTO department(name)
        VALUES ?`;
        db.query(sql, data.department, (err, result) => {
            if (err) throw err;
            console.log(`${data.department} department is added!`);
            followUp();
        });
    });
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'role',
            message: 'What is the title of role you want to add?',
            validate: title => {
                if (title) return true;
                else {
                    console.log("You need to enter the title of the role!");
                    return false;
                }
            }
        },

        {
            type: 'number',
            name: 'salary',
            message: 'How much is the salary of this role?',
        },

        {
            type: 'list',
            name: 'department',
            message: 'Which department does this role belong to?',
            choices: departmentSelect()
        }
    ]).then(data => {
        const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?,?,?)`;
        //Ask Ta:
        db.query(sql, (data.role, data.salary, data.department), (err, result) => {
            if (err) throw err;
            console.log(`${data.role} is added to the ${data.department}!`);
            followUp();
        });
    });
}

const updateRole = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'What is the name of the employee you want to update?',
            choices: employeeSelect()
        },
        {
            type: 'list',
            name: 'role',
            message: 'What new role do you want to assign to the employee you want to update?',
            choices: roleSelect()
        }
    ]).then(data => {
        const sql = `UPDATE employee 
                    SET role_id = ${data.role}
                    WHERE first_name =${data.name} AND last_name =${data.name}`
        //ask TA: how can i get last and first name from the data.name? can I use slice() method?
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(`${data.name}'s role has been changed to ${data.role}!`);
            followUp();
        })
    })
}

//these functions intend to generate a list of roles/employees/departments to choose from.
// const roleSelect = () => {

// }

// const employeeSelect = () => {

// }

// const departmentSelect = () => {

// }

//start the inquirer prompts
userPrompt();