const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();
const PORT = process.env.PORT || 5000;

//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('Api running');
});

//Define route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));

app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`);
});
