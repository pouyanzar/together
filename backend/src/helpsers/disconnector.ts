import User from "../models/userModel";

const disconnector = async (id: string) =>
  await User.findOneAndUpdate({ socket_id: id }, { $set: { socket_id: "" } });

export default disconnector;
  