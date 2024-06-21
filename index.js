const express = require('express');
const model = require('./model');
const app = express();
const cors = require("cors");

//use MiddleWare
app.use(express.urlencoded({extended: true}));
app.use(cors());


//set up a GET
app.get("/games", async (request, response) => {
    //Get the data from MongoDB expense
    try {
        let games = await model.Game.find();
        response.json(games);
    } catch (error) {
        //Send a Generic Error message if there is an issue
        console.log(error);
        response.status(400).send("Generic Error");
    }
});

//make a POST endpoint
app.post("/games", async (request, response) => {
    const data = request.body;
    console.log(request.body); 
    //^Add this line back if you would like to do console error checking
    
    try {
        //create a new MongoStudent using our model
        //Game and time are required, rating is not
        let newGame = new model.Game({
            title: data.title,
            time: data.time,
            rating: data.rating,
        });

        let error = newGame.validateSync();
        
        if(error) {
            response.json(400).json(error);
            return;
        }

        await newGame.save();
        response.status(201).json(newGame);

    } catch(error) {
        //Send a generic error message if there is an issue
        console.log(error);
        response.status(400).send("Generic Error");
    }
});

//delete functionality
app.delete("/games/:id", async (request, response) => {
    try {
        let isDeleted = await model.Game.findOneAndDelete({
            _id: request.params.id,
        });

        if(!isDeleted) {
            response.status(404).send("Could not find the game ID");
            return;
        }

        response.status(204).send("Game Deleted");
    } catch (error) {
        console.log(error);
        response.status(400).send("Generic Error");
    }
});

//Method for getting a single line
app.get("/game/:id", (request, response) => {
    try {
        model.Game.findOne({_id: request.params.id}).then( (game) => {
            if(game) {
                response.json(game);
            } else {
                response.status(404).send("Game has not been found :(");
            }
        });
    } catch(error) {
        console.log(error);
        response.status(400).send("Generic Error");
    }
});

app.put("/games/:id", async (request, response) => {
    try {
        const updatedGame = {
            title: request.body.title,
            time: request.body.time,
            rating: request.body.rating,
        };
        let putGame = await model.Game.findByIdAndUpdate({_id: request.params.id} , updatedGame, {new: true
        },);

        if(!putGame){
            response.status(404).send("You are trying to update an item that doesn't exist.");
            return;
        }
        response.status(204).json()
    } catch(error) {
        console.log(error);
        response.status(400).send("Generic Error");
    }
});

// start your server on a port
app.listen(8080, ()=> {
    console.log("Server is running on http://localhost:8080")
});