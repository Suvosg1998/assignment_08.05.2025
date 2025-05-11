const mongoose = require('mongoose');
class DBconnect{
    connectDB(){
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('MongoDB connected successfully..............');
        }).catch((err) => {
            console.log('MongoDB connection failed', err);
        });
    }
}
module.exports = new DBconnect();