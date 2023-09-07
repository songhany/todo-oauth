import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, todoItem } = req.body;

    try {
      await connectToDB();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.todolist.push(todoItem);
      await user.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  return res.status(405).end(); // Method not allowed
}