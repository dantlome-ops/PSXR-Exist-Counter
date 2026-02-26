const express = require('express');
const app = express();
app.use(express.json());
let globalData = {
    "test": "1"
};

app.get('/', (req, res) => {
    res.send('✅ PSXR Server is running!');
});
app.get('/global/global_exist_counts', (req, res) => {
    console.log("SendingData:", globalData);
    res.json(globalData);
});
app.post('/global/global_exist_counts', (req, res) => {
    try {
        const newData = req.body;
        console.log("RecivingData:", newData);
        for (let key in newData) {
            globalData[key] = newData[key];
        }
        console.log("DataUpdated:", globalData);
        res.json({ success: true, data: globalData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
