/*
Challenge #1: Customer View (Minimum Requirement)

SCHEMA: products:
item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100),
department_name VARCHAR(33)
price DEC(10,2),
stock_quantity INT NOT NULL

*/
var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SqlDatabaseRoot",
    database: "Bamazon"
})


customerInventoryPrompt();


function customerInventoryPrompt(){
    console.log('\nThanks for shopping at Bamazon!\n');
    inquirer.prompt([
        {
            message: 'Would you like to see the current inventory?',
            name: 'yes',
            type: 'confirm',
            default: true
        }
    ]).then(function(seeInventory){
        if(seeInventory.yes)
            showAllProducts()
        else
            customerOrder();
    })
} // end customerOrder function

function customerOrder(countFn){
    inquirer.prompt([
        {
        message: 'Enter the product ID: ',
        type: 'input',
        name: 'ID',
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
        }, {
        message: 'Enter quanity: ',
        type: 'input',
        name: 'quantity',
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        } 
    }
    ]).then(function(order,countFn){
        if (order.quantity == '1')
            var pluralizer = ' unit '
        else    
            var pluralizer = ' units ';
        
        var sql = "SELECT * FROM products WHERE ?? = ?";
        var inserts = ['item_id',order.ID];
        sql = mysql.format(sql,inserts);
        connection.query(sql, function(err, res) {
            if (err) 
                console.log(err)
            else {
            console.log('You\'ve placed an order for '+order.quantity+pluralizer+'of '+res[0].product_name+'.');

            // check inventory
            productCount(res[0].item_id, function(count){
                if (count > order.quantity) {
                    // adequate stock exists; ship it, then update stock
                    console.log('Great news! We have that in stock! They will be shipped shortly!\nYour total is $'+res[0].price*order.quantity+'.');
                    updateInventory(res[0].item_id,order.quantity);
                    // to do: prompt to order again or exit
                }
                else if (count == 0) {
                    // zero in inventory; log appropriate message and return user to inventory prompt
                    console.log('Sorry, we\'re out of stock.');
                    customerInventoryPrompt();
                }
                else if (count < order.quantity) {
                    // some in stock but not enough; message appropriately and send back to order input
                    console.log('We only have '+count+ ' left in stock. Please adjust your order.');
                    customerOrder();
                };
            }); // end productCount callback 


            /*
If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.

SCHEMA: products:
item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100),
department_name VARCHAR(33)
price DEC(10,2),
stock_quantity INT NOT NULL
*/
            }
        });
        
    })
} // end customerInput function
   
function productCount(id,callback){
// standalone function (might be needed many places) is passed product id and returns current inventory 

    var sql = "SELECT stock_quantity FROM products WHERE ?? = ?";
    var inserts = ['item_id',id];
    sql = mysql.format(sql,inserts);
    connection.query(sql, function(err,res){
        if (err) throw(err);
        callback(res[0].stock_quantity);
        });

} // end productCount function

function updateInventory(id,amount){
// standalone function is passed product id and successful order amount to update database 
    var sql = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
    var inserts = [amount,id];
    sql = mysql.format(sql,inserts);
    connection.query(sql, function(err,res){
        if (err) throw(err);
    });
    //showAllProducts();
    
            
} // end updateInventory function


function showAllProducts(){

    if (!connection) {
        connection.connect(function(err){
            if (err) throw err;
        });
    }
    else {
        var sql = "SELECT item_id,product_name,price FROM products ORDER BY product_name";
        sql = mysql.format(sql);
        connection.query(sql, function(err, res) {
            if (err) 
                console.log(err)
            else {
                console.table("\nCurrent products by name",res);
                customerOrder();
            };
        });
    };
} // end function showAllProducts




/*
Challenge #2: Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:
List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
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