const mongo = require("mongoose");
const Server = new mongo.Schema({

    prefix: { 
        type: String,
        default: process.env.PREFIX
    },

    id: { type: String },
});

module.exports = mongo.model("Servers", Server);