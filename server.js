const express = require('express');
const fs = require('fs').promises; // Use promises for better async handling
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Define the port for the server

app.use(bodyParser.json());

// Utility function to read JSON files
const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading ${filePath}: ${error.message}`);
    }
};

// Utility function to write JSON files
const writeJsonFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw new Error(`Error writing to ${filePath}: ${error.message}`);
    }
};

// Endpoint to update users.json
app.put('/users', async (req, res) => {
    const newUser = req.body;
    
    try {
        const usersData = await readJsonFile('users.json');
        usersData.users.push(newUser);
        await writeJsonFile('users.json', usersData);
        res.status(200).send('User added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to add announcements
app.post('/announcements', async (req, res) => {
    const newAnnouncement = req.body;
    newAnnouncement.date = new Date().toISOString(); // Add date field

    try {
        const announcementsData = await readJsonFile('announcements.json');
        announcementsData.push(newAnnouncement);
        await writeJsonFile('announcements.json', announcementsData);
        res.status(200).send('Announcement added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to get sorted announcements
app.get('/announcements', async (req, res) => {
    try {
        const announcementsData = await readJsonFile('announcements.json');
        announcementsData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
        res.json(announcementsData); // Return sorted announcements
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error.message);
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
