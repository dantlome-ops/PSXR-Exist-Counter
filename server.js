const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('✅ Server is alive'));
app.get('/global/global_exist_counts', (req, res) => res.json({test: "1"}));
app.listen(process.env.PORT || 3000, () => console.log('OK'));
