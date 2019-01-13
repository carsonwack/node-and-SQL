
var mysql = require("mysql");
var inquirer = require("inquirer");

// connection to mySQL
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Allstar5",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    connection.query("select * from products;", function (err, res) {
        if (err) {
            throw err;
        }
        console.log("\n\n\n\n\n");
        console.log("---All Results---");
        console.log("\n\n");
        console.table(res);
        console.table("\n");

        promptUser();
    });

});




function promptUser() {

    let inventoryArray = ['Pyro Flasks', 'Nondescript Balls', 'Creepy Dolls', 'Sticks', 'Fake Necklaces', 'Invisible Laser Pointers', 'Wikipedia Posters', 'FirePods', 'Robot Frogs', 'Cricket Bats'];

    // nested inquirer prompts to ensure second question is asked after first question.

    let query = "select product_name where item_id"

    inquirer.prompt([
        {
            type: 'input',
            name: 'idSelected',
            message: 'Type the Item ID of the item you want  (1 - 10):\n\n',
            validate: function (number) {
                if (number < 1 || number > 10) {
                    return "Must be between 1 - 10.";
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'unitsSelected',
            message: `\nHow many do you want?\n`,
            validate: function (number) {
                if (isNaN(number)) {
                    return "Please type a number.";
                }
                return true;
            }
        }
    ]).then(function (answer) {
        let querySelect = "select stock_quantity from products where item_id = ?";
        connection.query(querySelect, [answer.idSelected], function (err, res) {
            if (err) {
                throw err;
            }
            let currentStock = res[0].stock_quantity;
            if (currentStock < answer.unitsSelected) {
                console.log("\n\nInsufficient Quantity!\n\n");
                promptUser();
                console.log('\n\n');
            }
            else {
                let queryUpdate = "update products set stock_quantity = stock_quantity - ? where item_id = ?";
                connection.query(queryUpdate, [answer.unitsSelected, answer.idSelected], function (err, res) {
                    if (err) {
                        throw err;
                    }

                });
                connection.query("select * from products;", function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log("\n\n");
                    console.log("---Updated Inventory---\n");
                    console.table(res);
                    console.table("\n");

                });

                let queryPrice = "select price from products where item_id = ?"
                connection.query(queryPrice, [answer.idSelected], function (err, res) {
                    if (err) {
                        throw err;
                    }
                    let price = res[0].price;
                    // Rounds to 2 decimal places
                    let totalPrice = Number(price * answer.unitsSelected).toFixed(2);
                    console.log(`Total Cost: ${totalPrice}\n\n`);
                    postPurchase();

                });
            }

        });

    });

};


function postPurchase() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'anotherPurchase',
            message: 'Do you want to make another purchase?'
        }
    ]).then(function (answer) {
        if (answer.anotherPurchase) {
            console.log("\n\n")
            promptUser();
        }
        else {
            console.log("\n\nGoodbye, thanks for shopping!\n\n");
            process.exit();
        }

    });
}





