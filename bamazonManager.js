// we're going to need some modules:
var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");

// connect up to our dbase
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SqlDatabaseRoot",
    database: "Bamazon"
})

/*
Challenge #2: Manager View (Next Level)
Create a new Node application called bamazonManager.js. Running this application will:
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
*/

routeManager();

// give the manager user some options
function routeManager(){
    inquirer.prompt([
        {
        message: '\nWelcome to Bamazon Inventory Manager!\n',
        type: 'list',
        name: 'option',
        choices: [
            'View products',
            'View low inventory',
            'Add inventory',
            'Add new product',
            'Exit'
            ]    
    }
    ]).then(function(manager){
        // handle user input
        console.log(manager);
        switch(manager.option) {
            case 'View products':
                showInventory();
                break;
            case 'View low inventory':
                // do stuff
                break;
            case 'Add inventory':
                // do stuff
                break;
            case 'Add new product':
                // do stuff
                break;
            case 'Exit':
            default:
                connection.end();
                console.log('\nGoodbye! Have a great day!\n');
                break;
        }
    });
}
function showInventory(){
    if (!connection) {
        connection.connect(function(err){
            if (err) throw err;
        });
    };
    // build a query
    var sql = "SELECT * FROM products ORDER BY department_name";

    // use mysql module's method to escape query
    sql = mysql.format(sql);
    
    // send off our query
    connection.query(sql, function(err, res) {
        if (err) 
            console.log(err)
        else {
            // output results using the table module
            console.table("\nCurrent products by department",res);
            
            // send manager user back to menu
            routeManager();
        };
    });
};
     // end function showInventory   

/*
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
Challenge #3: Supervisor View (Final Level)

Create a new MySQL table called departments. Your table should include the following columns:
department_id
department_name
over_head_costs (A dummy number you set for each department)
total_sales
Modify the products table so that theres a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the program will calculate the total sales from each transaction.
Add the revenue from each transaction to the total_sales column for the related department.
Make sure your app still updates the inventory listed in the products column.
Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
View Product Sales by Department
Create New Department
When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
department_id	department_name	over_head_costs	product_sales	total_profit
01	Electronics	10000	20000	10000
02	Clothing	60000	100000	40000
The total_profit should be calculated on the fly using the difference between over_head_costs and total_sales. total_profit should not be stored in any database. You should use a custom alias.
If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.
Hint: You may need to look into aliases in MySQL.
HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)
*/