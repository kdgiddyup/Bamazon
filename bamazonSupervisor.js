/*
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