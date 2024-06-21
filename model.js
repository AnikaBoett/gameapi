const mongoose = require("mongoose");

mongoose.connect (
    process.env.DBPASSWORD
);

const GameEntrySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Game needs to have a name"],
        },
        time: {
            type: Number,
            //refers to the amount of time the user has played the game for
            required: [true, "You must log how long you've played the game for"],
        },
        rating: {
            type: Number,
        },
    },
    { timestamps: true },
);

const Game = mongoose.model("GameEntry", GameEntrySchema);

module.exports = {
    Game: Game,
};