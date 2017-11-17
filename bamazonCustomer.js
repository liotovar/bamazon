var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    questions();
  });
}

function questions() {
connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

  inquirer
    .prompt([
      {
      name: "productID",
      type: "input",
      message: "What is the ID of the item you would like to purchase?"
    },
    {
      name: "amount",
      type: "input",
      message: "How many items would you like to purchase?"
    }])

    .then(function(answer) {

        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_ID == answer.productID) {
            chosenItem = results[i];
          }
        }
if (chosenItem.stock_quantity > parseInt(answer.amount)) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: stock_quantity -= answer.amount
              },
              {
                id: chosenItem.item_ID
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Item(s) purchased!");
              readProducts();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Not enough quantity available.");
          readProducts();
        }
      });
  });
}