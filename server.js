const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Endpoint to update users.json
app.put('/users', (req, res) => {
    const newUser = req.body;
    
    fs.readFile('users.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading users.json');
        }
        
        const usersData = JSON.parse(data);
        usersData.users.push(newUser);
        
        fs.writeFile('users.json', JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to users.json');
            }
            res.status(200).send('User added successfully');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
