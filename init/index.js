const mongoose= require('mongoose');
const data= require('./data.js');
const Listing = require('../models/listing.js');

main()
.then(()=>{
    console.log("connected to mongoDB");
})
.catch((err)=>{
    console.log("error connecting to mongoDB", err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    const updatedData = data.data.map((obj) => ({...obj, owner: new mongoose.Types.ObjectId("69a2c459de1e9fe00c815544")}));
    await Listing.insertMany(updatedData);
    console.log("Database Initialized with sample data");
};

initDB();