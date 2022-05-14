const connection = require("./connection");


class DB {
    constructor(connection){
        this.connection = connection;
    }

    findAllRoles(){
        //Put promise here because it takes time to query the DATABASE
        //Then we know we need to use async/await or .then to in the calling function
        return this.connection.promise().query(
            "SELECT * from role"
        )
    }

    findAllDepartments(){
        return this.connection.promise().query(
            "SELECT * from department"
        )
    }

    findAllEmployees(){
        return this.connection.promise().query(
            "SELECT * from employee"
        )
    }

    addEmployee(employee){
        console.log("employee from front end", employee)
        return this.connection.promise().query(
            "INSERT INTO employee SET ?", employee
        ) 
    }

    addDepartment(department){
        console.log(department+" department added")
        return this.connection.promise().query(
            `INSERT INTO department SET ?`, department
        )
    }

    addRole(role){
        console.log(role+" role added")
        return this.connection.promise().query(
            `INSERT INTO role SET ?`, role
        )
    }

    updateRole(employee){
        return this.connection.promise().query(
            `UPDATE employee SET role_id = ?, 
             manager_id = ? 
             WHERE id = ${employee.id}`
            ,[employee.role_id, employee.manager_id]
        )
    }
}

module.exports = new DB(connection)