import mongoose, { mongo } from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log("MongoDB isConnected already");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'nextjs_todolist',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}