const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- Инициализация Firebase ---
try {
  const serviceAccount = JSON.parse(process.env.PSXR_DANTLOME_EXISTS);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firestore connected");
} catch (e) {
  console.error("❌ Failed to parse service account:", e.message);
  process.exit(1); // Остановить сервер, если ключ не работает
}

const db = admin.firestore();
const docRef = db.collection('global').doc('global_exist_counts');

// --- Эндпоинты ---

// 1. Проверка сервера
app.get('/', (req, res) => {
  res.send('PSXR Server is running');
});

// 2. Получить все экзисты (с подробным логированием)
app.get('/global/global_exist_counts', async (req, res) => {
  console.log(`📥 GET /global/global_exist_counts at ${new Date().toISOString()}`);
  try {
    const doc = await docRef.get();
    console.log("📄 Документ получен, существует:", doc.exists);

    if (!doc.exists) {
      console.log("📄 Документ не найден, возвращаем {}");
      return res.json({});
    }

    const data = doc.data();
    console.log("📄 Данные документа:", JSON.stringify(data));
    res.json(data);

  } catch (error) {
    console.error("❌ Ошибка в GET /global/global_exist_counts:", error.message);
    console.error(error.stack); // Печатаем полный стек ошибки
    res.status(500).json({
      error: error.message,
      code: error.code,
      details: "Ошибка при получении данных из Firestore"
    });
  }
});

// 3. Сохранить все экзисты (из игры)
app.post('/global/global_exist_counts', async (req, res) => {
  console.log(`📥 POST /global/global_exist_counts at ${new Date().toISOString()}`);
  console.log("Тело запроса:", JSON.stringify(req.body));
  try {
    const data = req.body;
    await docRef.set(data, { merge: true });
    console.log("✅ Данные сохранены в Firestore");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка в POST /global/global_exist_counts:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. Добавить или обновить одно поле
app.post('/global/global_exist_counts/field', async (req, res) => {
  try {
    const { field, value } = req.body;
    if (!field) {
      return res.status(400).json({ error: "Field name required" });
    }
    await docRef.set({ [field]: value }, { merge: true });
    res.json({ success: true, field, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
