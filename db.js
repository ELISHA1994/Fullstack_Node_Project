const mongoose = require('mongoose')

const dbRoute = 'mongodb+srv://todoappDB:todoappdb@cluster0-sjh2l.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(
    process.env.MONGO_URI || dbRoute,
    { useNewUrlParser: true, useCreateIndex: true },
    function (err) {
        if (err) throw err
        console.log('Successfully Connected')
    }
)

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// check if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose





