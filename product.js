var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
    title: String,
    price: Number,
    instock: Boolean,
    photo: String,
    deliverydate: { type: Date, default: Date.now },
    modelno:String,
    engineCC:String,
    color: String,
    AC: Boolean,
    powersteering:Boolean,
    airbag:String,
    rearcamera:Boolean,
    customerage:Number,
    carstatus:String,
    priceGST:String,
    priceRoadTAX:String,
    insurance_amount: Number
});
module.exports = mongoose.model('Product', ProductSchema);
