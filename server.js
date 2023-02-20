const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Api running');
});

app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`);
});
