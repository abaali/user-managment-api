import mongoose from "mongoose";
export const connect = (dbUri) => {
  return mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};
