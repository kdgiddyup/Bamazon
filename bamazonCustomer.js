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
            message: 'Would you like to see the current inventory before placing an order?',
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

function customerOrder(){
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
    ]).then(function(order){
        var sql = "SELECT * FROM products WHERE ?? = ?";
        var inserts = ['item_id',order.ID];
        sql = mysql.format(sql,inserts);
        connection.query(sql, function(err, res) {
            if (err) 
                console.log(err)
            else {
            console.log('Order: '+res[0].product_name+'\nQuanity: '+order.quantity);

            // check inventory
            productCount(res[0].item_id, function(count){
                if (count >= order.quantity) {
                    // adequate stock exists; ship it, then update stock
                    console.log('Great news! We have that in stock! They will be shipped shortly!\nYour total is $'+res[0].price*order.quantity+'.');
                    updateInventory(res[0].item_id,order.quantity);
                    routeCustomer();
                }
                else if (count == 0) {
                    // zero in inventory; log appropriate message and return user to inventory prompt
                    console.log('Sorry, we\'re out of stock.');
                    routeCustomer();
                }
                else if (count < order.quantity) {
                    // some in stock but not enough; message appropriately and send back to order input
                    console.log('We only have '+count+ ' left in stock. Please adjust your order.');
                    customerOrder();
                };
            }); // end productCount callback 
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

function routeCustomer(){
    inquirer.prompt([
        {
        message: '\nWould you like to exit or order again?',
        type: 'list',
        name: 'route',
        choices: ['Exit','Order again']
        }, 
    ]).then(function(user){
        if (user.route == 'Exit') {
            console.log("\nThanks for visiting! Have a great day!\n");
            connection.end();
        }
        else {
            customerInventoryPrompt();
        }
    });
}