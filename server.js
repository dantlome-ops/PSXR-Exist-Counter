const express = require('express');
const app = express();
app.use(express.json());

// Хранилище данных прямо в памяти сервера
let globalData = {
    "test": "1"
};

app.get('/', (req, res) => {
    res.send('✅ PSXR Server is running!');
});

// GET - получить все экзисты
app.get('/global/global_exist_counts', (req, res) => {
    console.log("📤 Отправляем данные:", globalData);
    res.json(globalData);
});

// POST - обновить экзисты
app.post('/global/global_exist_counts', (req, res) => {
    try {
        const newData = req.body;
        console.log("📥 Получены новые данные:", newData);
        
        // Обновляем данные (мержим)
        for (let key in newData) {
            globalData[key] = newData[key];
        }
        
        console.log("✅ Данные обновлены:", globalData);
        res.json({ success: true, data: globalData });
    } catch (error) {
        console.error("❌ Ошибка:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
