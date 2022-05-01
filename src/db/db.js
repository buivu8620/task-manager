const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.CONNECT_URL);
    console.log("connect successfully");
  } catch (error) {
    console.log("connect failure");
  }
}

module.exports = { connect };
