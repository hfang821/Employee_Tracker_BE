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
        //Question: Why should I use async and await? and if I do, should I keep my other functions asynchronous?
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

//ask the user what they want to do next..
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
const viewEmployees = async () => {
    const sql = 
    `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager on manager.id = employee.manager_id
    `;
    //need to put a await when the promise is present
    //try && catch is basically .then/.catch
    try {
        const result = await db.promise().query(sql)
        const [rows, fields] = result;
        const showTable = table.getTable(rows);
        console.log(showTable);
        followUp();
    } catch (error) {
        console.log(error);
    }
}

//.then method
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
    }).then(() => {followUp()});
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
    }).then(() => {followUp()});
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
}

//Question: How to connect the role to a role id? && the manager name to a id?
//Answer: Map the role table and extract the {id, title} in a object. Then take the title as "name", and "id" as value and put in the inquirer choices.


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
        let departmentName = {name: data.department};
        dbMethods.addDepartment(departmentName)
        .then(() => {console.log(`${departmentName.name} department is added!`)})
        .then(() => followUp())
    })
};


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
        }
    ]).then(answer => {
        let newTitle = answer.role;
        let newSalary = answer.salary;

        dbMethods.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            console.log("Department Choices", departmentChoices)

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: departmentChoices
                }
            ])
            .then(answer => {
                let departmentId = answer.department;

                let role = {
                    title: newTitle,
                    salary: newSalary,
                    department_id: departmentId
                }

                dbMethods.addRole(role)
                .then(() => console.log(`Added ${role.title} to the database!`))
                .then(() => followUp())
            })
        }) 
    });
}

const updateRole = async () => {
    //get the table of all employees 
    //so the system needs time to execute the promise but without a async/await OR .then, it will be pending when it wants to execute other lines of codes
    let employees = await dbMethods.findAllEmployees();
    const [rows] = employees;
    console.log(rows);
    //map the employees
    const employeeChoices = rows.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'What is the name of the employee you want to update?',
            choices: employeeChoices
        }
    ]).then((answer) => {
        console.log('employees')
        console.log(answer);
        // let firstName = answer.first_name;
        // let lastName = answer.last_name;
        let employeeID = answer.name;
        
            dbMethods.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }))

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What new role do you want to assign to the employee you want to update?',
                            choices: roleChoices
                        }
                    ])
                    .then(data => {
                        console.log('role')
                        console.log(data);
                        let roleId = data.role;

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
                                    message: "Who is the employee's new manager?",
                                    choices: employeeChoices
                                }
                            ])
                            .then((answer) => {
                                console.log('manager')
                                console.log(answer);
                                let employee = 
                                    {
                                        // first_name: firstName,
                                        // last_name: lastName,
                                        role_id: roleId,
                                        manager_id: answer.manager,
                                        id: employeeID
                                    }
                            //Question: How to pass in a employee id to be passed into the dbMethods function?
                            //Answer: include the employee id in the employee object & call employee.id in the dbMethods.
                            dbMethods.updateRole(employee)
                            .then(() => console.log("The employee's role has been updated."))
                            .then(() => followUp())
                    })
                })
            })
        })
    })
}

//start the inquirer prompts
userPrompt();




