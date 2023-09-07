import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { userId, todoId } = req.body;

  try {
    await connectToDB();

    // Delete the todo from the user's todolist
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { todolist: { id: todoId } } }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ success: false, error: 'Error deleting todo' });
  }
}
