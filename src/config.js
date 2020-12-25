//production config
export const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  jwt_secret: process.env.JWT_SECRET || "secret_key",
};
