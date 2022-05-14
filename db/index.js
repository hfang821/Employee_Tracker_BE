const connection = require("./connection");

class DB {
    constructor(connection){
        this.connection = connection;
    }

    findAllRoles(){
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

    updateRole(employeeRole,employeeId){
        return this.connection.promise().query(
            `UPDATE employee SET ? WHERE id = ${employeeId}`, employeeRole 
        )
    }




}

module.exports = new DB(connection)