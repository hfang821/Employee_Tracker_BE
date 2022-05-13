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

    updateRole(){
        
        return this.connection.promise().query(
            "write query to update by id", 
        )
    }




}

module.exports = new DB(connection)