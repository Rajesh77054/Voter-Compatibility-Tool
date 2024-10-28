module.exports = {
  databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/devDB",
  port: process.env.PORT || 5000,
};
