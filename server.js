const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// File path where the data is stored
const filePath = 'db.json';

// Define a route to handle updating the high score
app.post('/snake/highScore', (req, res) => {
    const newHighScore = req.body.highScore;
    const name = req.body.name;

    // Read the existing data from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({error: 'Failed to read file'});
        } else {
            let myDb = {};

            try {
                // Parse the JSON data from the file
                myDb = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                res.status(500).json({error: 'Failed to parse JSON'});
                return;
            }

            // Check if the new high score is greater than the existing high score
            if (newHighScore > myDb.highScore) {
                // Update the high score in the object
                myDb.highScore = newHighScore;
                myDb.name = name;

                // Convert the updated data to a string format
                const updatedDataString = JSON.stringify(myDb);

                // Write the updated data back to the file
                fs.writeFile(filePath, updatedDataString, (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing to file:', writeErr);
                        res.status(500).json({error: 'Failed to write file'});
                    } else {
                        console.log('Data written to file successfully!');
                        res.status(200).json({message: 'High score updated successfully'});
                    }
                });
            } else {
                console.log('New high score is not greater than the existing high score.');
                res.status(400).json({error: 'New high score is not greater'});
            }
        }
    });
});
app.get('/snake/highScore', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        res.json(JSON.parse(data))
    })
})
app.get('/snake', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
