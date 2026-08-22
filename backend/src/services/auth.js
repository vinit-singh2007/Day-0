import jwt from "jsonwebtoken";

const setUser = (newUser) => {
  const secretkey = process.env.JWT_SECRET_KEY;
  // Payload me _id aur id dono bhej rahe hain taaki controller me confusion na ho
  return jwt.sign(
    { 
      _id: newUser._id, 
      id: newUser._id, 
      email: newUser.email 
    },
    secretkey,
    { expiresIn: "3d" }
  );
};

const getUser = (token) => {
  if (!token) return null;
  
  const secretkey = process.env.JWT_SECRET_KEY; // <-- Yahan secretkey add kar di
  
  try {
    return jwt.verify(token, secretkey);
  } catch (error) {
    return null;
  }
};

export { setUser, getUser };