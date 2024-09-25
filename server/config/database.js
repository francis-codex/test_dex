import { connect } from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Mongoose Connected");
    });
};

export default connectDatabase;
