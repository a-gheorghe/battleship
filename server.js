const express = require('express');
const app = express(); // this creates a new instance of express? whats the constructor? could I just use express() instead of app in my code or would that be wrong becuase a new instance each time?

const path = require('path');

//bodyParser gives us access to req.body
const bodyParser = require('body-parser');
// this tells bodyparser to turn form posts into req.body
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)


// to see if connection has succeeded or failed
mongoose.connection.on('connected', () => {
  console.log('Success! Conntected to MongoDB')
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB' + err);
  process.exit(1)
});

// public is the folder name
// if a request requires a specific file, chekc the public folder for it
// if it is there, serve it from there
// express static specifically serves index.html on slack so the first get request is not actually required
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get('/newGame', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newGame.html'));
})
// *** Don't need these anymore because of the express.static('public') call****
// app.get('/styles.css', (req, res) => {
//   res.sendFile(path.join(__dirname, './styles.css'));
// });
//
// app.get('/script.js', (req, res) => {
//   res.sendFile(path.join(__dirname, './script.js'));
// });
// *****************************************************************************

app.post('/newGame', (req,res) => {
  console.log(req.body);
  res.send('here is your post');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
