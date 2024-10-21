const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    reservationTime: {
        type: String,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    tableType: {
        type: String,
        enum: ["4-person", "6-person"],
        required: true
    },
    
});

module.exports = mongoose.model("Reservation", ReservationSchema);
