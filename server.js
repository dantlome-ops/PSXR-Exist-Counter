const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

try {
  const serviceAccount = JSON.parse(process.env.PSXR_DANTLOME_EXISTS);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firestore connected");
} catch (e) {
  console.error("Failed to parse service account:", e.message);
}

const db = admin.firestore();

app.get('/player/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const docRef = db.collection('players').doc(userId);
    const doc = await docRef.get();
    res.json(doc.exists ? doc.data() : {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/player/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await db.collection('players').doc(userId).set(req.body, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/global/global_exist_counts', async (req, res) => {
  try {
    const docRef = db.collection('global').doc('global_exist_counts');
    const doc = await docRef.get();
    res.json(doc.exists ? doc.data() : {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/global/global_exist_counts', async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.set(data, { merge: true });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/global/global_exist_counts/field', async (req, res) => {
  try {
    const { field, value } = req.body;
    if (!field) {
      return res.status(400).json({ error: "Field name required" });
    }
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.set({ [field]: value }, { merge: true });
    
    res.json({ success: true, field, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/global/global_exist_counts/fields', async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: "Data object required" });
    }
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.set(data, { merge: true });
    
    res.json({ success: true, updated: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/global/global_exist_counts/field/:fieldName', async (req, res) => {
  try {
    const fieldName = req.params.fieldName;
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.update({
      [fieldName]: admin.firestore.FieldValue.delete()
    });
    
    res.json({ success: true, message: `Field ${fieldName} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/global/global_exist_counts/increment', async (req, res) => {
  try {
    const { field, amount = 1 } = req.body;
    if (!field) {
      return res.status(400).json({ error: "Field name required" });
    }
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.set({
      [field]: admin.firestore.FieldValue.increment(amount)
    }, { merge: true });
    
    res.json({ success: true, field, amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/global/global_exist_counts/decrement', async (req, res) => {
  try {
    const { field, amount = 1 } = req.body;
    if (!field) {
      return res.status(400).json({ error: "Field name required" });
    }
    
    const docRef = db.collection('global').doc('global_exist_counts');
    await docRef.set({
      [field]: admin.firestore.FieldValue.increment(-amount)
    }, { merge: true });
    
    res.json({ success: true, field, amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('PSXR Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
