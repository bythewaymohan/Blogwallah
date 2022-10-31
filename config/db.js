const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            // userNewUrlParser: true,
            // userUnifiedTopology:true,
            // useFindAndModify:false

            //in mongoDB 6.o or above no need to decleare because of its pre define in mongoDB 6.0 or above
        });
        
       // console.log(`MongoDB Connected : ${conn.connection.host}`);
    }catch (err) {
        console.error(err)
        process.exit(1)

    }
}


module.exports = connectDB