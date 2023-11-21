const mongoose = require("mongoose");
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Kết nối db thành công");
    } catch (error) {
        console.log("kết nối db thất bại");
    }
}

module.exports = { connect };
