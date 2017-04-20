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
        switch(manager.option) {
            case 'View products':
                showInventory();
                break;
            case 'View low inventory':
                showLowInventory();
                break;
            case 'Add inventory':
                addInventory();
                break;
            case 'Add new product':
                addNewProduct();
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
}; // end function showInventory   

function showLowInventory(){
    // build a query
    var sql = "SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name";

    // use mysql module's method to escape query
    sql = mysql.format(sql);
    
    // send off our query
    connection.query(sql, function(err, res) {
        if (err) 
            console.log(err)
        else {
            // output results using the table module
            console.table("\nLow inventory products by department",res);
            
            // send manager user back to menu
            routeManager();
        };
    });
}; // end showLowInventory function

function addInventory(){
     // build a query: We need a list of products
    var sql = "SELECT product_name FROM products ORDER BY product_name";

    // use mysql module's method to escape query
    sql = mysql.format(sql);
    
    // send off our query
    connection.query(sql, function(err, res) {
        if (err) 
            console.log(err)
        else {
            // use results to build a prompt list
            var options = [];
            for (var i=0;i<res.length;i++){
                options.push(res[i].product_name);
            }
            // prompt for products to add
            inquirer.prompt([
                {
                message: '\nWhich product do you need to order?\n',
                type: 'list',
                name: 'option',
                choices: options    
            },
            {
                message: '\nQuantity to order?\n',
                type: 'input',
                name: 'amount',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
            ]).then(function(product){
                // handle user input
                // build an UPDATE query that updates selected product's stock quantity with the order amount
                var sql = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?";
                var inserts = [product.amount,product.option];

                // use mysql module's method to escape query
                sql = mysql.format(sql,inserts);
                
                // send off our query
                connection.query(sql, function(err, res) {
                    if (err) 
                        console.log(err)
                    else {
                        console.log('\nUpdate successful\n');
                    }
                    // send manager user back to menu
                    routeManager();
                }); // update callback
            }); // end prompt callback
        }
    }) // end product list query callback
}; // end addInventory function

function addNewProduct(){
    console.log('\nNew product ordering\n');
    // We'll need a product_name, department_name, price and stock_quantity from the manager
     inquirer.prompt([
        {
            message: '\nProduct name: \n',
            type: 'input',
            name: 'product',
            validate: function(value) {
                if (value == '') {
                    return false;
                }
                return true;
            }    
        },
        {
            message: '\nDepartment name: \n',
            type: 'input',
            name: 'department',
            validate: function(value) {
                if (value == '') {
                    return false;
                }
                return true;
            }
        },
        {
            message: '\nRetail price: $\n',
            type: 'input',
            name: 'price',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            message: '\nQuantity: \n',
            type: 'input',
            name: 'amount',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ]).then(function(product){
            // output order details
            console.log('\nOrder details: \nProduct: '+product.product+'\nDepartment: '+product.department+'\nRetail price: $'+product.price+'\nQuantity: '+product.amount+'\n');

            // build query
            var sql = 'INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?)';
            var inserts = [[product.product,product.department,product.price,product.amount]];
            sql = mysql.format(sql,inserts)
            console.log(sql);
            connection.query(sql, function(err, res) {
                if (err) 
                    console.log(err)
                else {
                    console.log('\nUpdate successful\n');
                }
                // send manager user back to menu
                routeManager();
            })
        })
} // end add new product function