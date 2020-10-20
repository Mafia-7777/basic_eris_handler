const mongo = require('mongoose');
module.exports.init = async () => {
   
    mongo.connect(process.env.MongoDBconnectUrl, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true});

    
    mongo.connection.on('uninitialized', () => console.log('MongoDB is uninitialized'));

    mongo.connection.on('connecting', () => console.log('MongoDB is connecting'));
    mongo.connection.on('connected', () => console.log('MongoDB is connected'));

    mongo.connection.on('disconnecting', () => console.log('MongoDB is disconnecting'));
    mongo.connection.on('disconnected', () => console.log('MongoDB is disconnected'));

};