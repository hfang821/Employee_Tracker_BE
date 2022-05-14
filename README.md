# Employee_Tracker_BE
Inquirer &amp; SQL queries Backend

## Description:

* This program is designed to build a employee database using mysql && the functionality of modifying the database in the terminal window using inquirer.js.
* This project was completed based on the Node.js, inquirer.js and mysql database, and can be run once installed.
* I have learned the ways to work at the server-side of javaScript database development, so that the front-end can retrieve the data by a set of query statements.

## Built By:
* JavaScript
* Node.js
* npm (inquirer.js)
* npm (mysql2)
* npm (console.table)

# Wall-Around Installation Video
* How to install & how to use: https://drive.google.com/file/d/1S-kOSdN9TpeFM9DgXSlrc8HUmYtJdAM6/view
* How to seed the database with data: https://drive.google.com/file/d/1CtpPGW-dNAHRgXEdWSWkr6izdURe-R_b/view


## How to Install:
* Open Gitbash/terminal, navigate towards your project location from your root by using "cd ./ project location"
* Choose a clone option from the "Employee_Tracker_BE" repository (either HTTPS or SSH should work)
* In Gitbash, type "git clone HTTPS or SSH"
* Once the clone is successful, navigate to the root directory of this repo.
* Enter `npm init` into the terminal.
* Enter `npm install inquirer` into the terminal to install the inquirer.js package, Enter `npm install console.table --save` into the terminal to install the console.table package and enter `npm install mysql2` to install the mysql2 package and you are good to go!

## How to initialize the database:
1. In your command window/gitbash shell, enter `mysql -u root -p` and then type your password of your sql account.
![image](https://user-images.githubusercontent.com/95199209/168446089-2de7b758-e9d5-4d22-b7d6-c35e90f19e10.png)

2. Now in your sql command window, type in `source db/db.sql` to create a new database called `employee_tracker_db`
<br><br>
![image](https://user-images.githubusercontent.com/95199209/168446117-c6f48c0c-c126-47a8-8f2f-34d388a5c4d7.png)

3. type in `source db/schema.sql` to feed the relational tables into the database.
![image](https://user-images.githubusercontent.com/95199209/168446188-7aaf829e-4c00-44ce-b291-e62e650fe52c.png)



4. type in `source db/seeds.sql` to seed some customized data into the tables.
 <br><br>
![image](https://user-images.githubusercontent.com/95199209/168446216-c5fcc0c4-29ff-419f-b0ce-6715c153efa4.png)

5. Type in `SELECT * FROM employee` Your initial-stage employee table should look like:
![image](https://user-images.githubusercontent.com/95199209/168446261-a7047da1-d92c-4470-9d94-60d205a69b06.png)

## How to Use:
1. Navigate (`cd`) to the root directory in your terminal. Enter `node index.js`, if the question prompts started to appear, you can proceed.
![image](https://user-images.githubusercontent.com/95199209/168443931-a49d7c94-a814-42ba-a4ed-f647d68032fd.png)

2. After each task, you can answer 'Y' or 'y' to the followUp question to return to the main menu or say 'N' or 'n' to exit.
![image](https://user-images.githubusercontent.com/95199209/168443994-b76e7b23-56de-4cb5-99b9-25642853d9f9.png)\

---

### ©️2022 Kevin (Haoyu) Fang
