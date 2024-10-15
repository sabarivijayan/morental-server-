import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Replace with your secret key

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

// Function to extract user ID from the token
export const getUserIdFromToken = (token) => {
  const decoded = verifyToken(token); // Verify and decode the token
  return decoded.id; // Return the user ID from the decoded token
};
