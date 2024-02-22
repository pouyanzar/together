import { type ExpressFunction } from "../types/expressFunction";
import User from "../models/userModel";

export const findUserByEmail: ExpressFunction = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });
    res.json(user);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const addSocketId: ExpressFunction = async (req, res) => {
  const { socketId, email } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { socket_id: socketId } }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
