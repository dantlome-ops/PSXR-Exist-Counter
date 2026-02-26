const express = require('express');
const app = express();
app.use(express.json());

let localData = {
    "test": "1"
};

app.get('/', (req, res) => {
    res.send('PSXR Server is running');
});

app.get('/global/global_exist_counts', (req, res) => {
    res.json(localData);
});

app.post('/global/global_exist_counts', (req, res) => {
    try {
        const newData = req.body;
        console.log("Received data:", newData);
        
        for (let key in newData) {
            localData[key] = newData[key];
        }
        
        res.json({ success: true, data: localData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
