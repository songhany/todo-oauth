import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists.'],
    require:[true, 'Email is required.'],
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
  },
  todolist: [
    {
      // Define the structure of each object in the array
      id: Number,
      title: String,
      completed: Boolean,
    }
  ]
})

const User = models.User || model("User", UserSchema);

export default User;