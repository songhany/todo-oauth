import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { userId, todoId } = req.body;

  try {
    await connectToDB();

    // Toggle the todo completion status in the user's todolist
    await User.updateOne(
      { _id: userId, 'todolist.id': todoId },
      { $set: { 'todolist.$.completed': true } }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error toggling todo completion status:', error);
    return res.status(500).json({ success: false, error: 'Error toggling todo completion status' });
  }
}
