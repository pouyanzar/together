import { type ExpressFunction } from "../types/expressFunction";
import User from "../models/userModel";

// const updateSocketId = async (email: string, socketId: string) => {
//   try {
   
//     // console.log("updated user:", user);
//   } catch (err) {
//     console.log("there is an error!");
//   }
// };

// export const findUserByEmail = async (email: string) => {
//   const user = await User.findOne({ email: email });
//   return user;
// };

export const findUserByEmail: ExpressFunction = async (req, res) => {
  const {email} = req.body
  console.log(req.body)
  try {
    // updateSocketId(socketId,email)
    const user = await User.findOne({ "email":email });
    res.json(user);
    
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

};

export const addSocketId: ExpressFunction = async (req, res) => {
  const {socketId, email} = req.body
  console.log(req.body)
  try {
    // updateSocketId(socketId,email)
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { socket_id: socketId } }
    );
    res.json(user)
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }

};