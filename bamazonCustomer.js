/*
Challenge #1: Customer View (Minimum Requirement)

products table schema:
item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100),
department_name VARCHAR(33)
price DEC(10,2),
stock_quantity INT NOT NULL

product,dept,price,stock
sunglasses,clothing accessories,10,50
boys' Hawaiian shirt,children's clothing,30,30
girls' beach coverup,children's clothing,25,30
boys' flip-flops,children's footwear,15,50
girls' flip-flops,children's footwear,15,50
men's flip-flops,men's footwear,25,50
women's flip-flops,women's footwear,30,50
men's Hawaiian shirt,men's clothing,40,30
women's beach coverup,women's clothing,40,30
beach towels,beach accessories,50,20
sunscreen,beach accessories,10,100
beach umbrella,beach accessories,230,20
beach tote,beach accessories,30,50
beach paddle game,beach accessories,20,50
girls' bathing suit,children's clothing,40,50
boys' swim trunks,children's clothing,30,50
women's bathing suit,women's clothing,45,50
men's swim trunks,men's clothing,35,50

Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
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
function showAllProducts(){
    connection.connect(function(err){
        if (err) throw err;
    });

    
    var sql = "SELECT item_id,product_name,price FROM products ORDER BY product_name";
    var sql = mysql.format(sql);
    connection.query(sql, function(err, res) {
        if (err) 
            console.log(err)
        else {
            console.table("\nCurrent products by name",res);
            connection.end();
        }
    });
} // end function showAllProducts
showAllProducts();


/*

The app should then prompt users with two messages.
The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.
If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.
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