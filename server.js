var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require('./product');

var Client = require('node-rest-client').Client;
var client = new Client();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();
 
// all other code will go here 
 
app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('REST API is runnning at ' + port);

mongoose.connect('mongodb://localhost:27017/products');

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});




router.route('/products').post(function (req, res) {
 
     var p = new product();
    p.title = req.body.title;
    p.price = req.body.price;
    p.instock = req.body.instock;
    p.photo = req.body.photo;
    p.deliverydate = req.body.deliverydate;
    p.modelno = req.body.modelno;
    p.engineCC = req.body.engineCC;
    p.color = req.body.color;
    p.AC = req.body.AC;
    p.powersteering = req.body.powersteering;
    p.airbag = req.body.airbag;
    p.rearcamera = req.body.rearcamera;
    p.customerage = req.body.customerage;
    p.carstatus = req.body.carstatus;
    p.priceGST=(p.price*0.10)+p.price;
    p.priceRoadTAX = p.price*0.06;

    var args = {
        data: { 
                age: p.customerage,
                price: p.price
              },
        headers: { "Content-Type": "application/json" }
    };
 
    client.post("http://localhost:8080/api/calculate_insurance", args, function (data, response) {
        // parsed response body as js object 
        var customer_details = JSON.stringify(args.data);
        console.log("Customer Details: ", customer_details);
        // raw response 
        console.log("Response from Insurance app: ", data);
        
        var insurance_output = data;
        p.insurance_amount = insurance_output.insurance_amount;
        console.log("Insurance cost:", insurance_output);
      
        p.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.send({ message: 'Product Created !' })
        })
    });
});
router.route('/products').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {
            res.send(err);
        }
        res.send(products);
    });
});



router.route('/products/:product_id').get(function (req, res) {
 
    product.findById(req.params.product_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});
router.route('/products/:product_id').delete(function (req, res) {
 
    product.remove({ _id: req.params.product_id }, function (err, prod) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    })
 
});