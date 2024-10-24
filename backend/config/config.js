require('dotenv').config();

module.exports = {
    databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/mydatabase",
    port: process.env.PORT || 5000
};
