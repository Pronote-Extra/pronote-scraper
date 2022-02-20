require('dotenv').config();

const { urlencoded } = require('express');
const express = require('express');
const basicAuth = require('express-basic-auth');

const scraper = require('./scraper');

const app = express();

app.use(express.json());
app.use(urlencoded({
    extended: true
}));

// const username = process.env.USERNAME;
// const password = process.env.PASSWORD;

// app.use(basicAuth({
//     users: { [username]: password },
//     unauthorizedResponse: getUnauthorizedResponse
// }))

// function getUnauthorizedResponse(req) {
//     return req.auth
//         ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
//         : 'No credentials provided'
// };

app.get('/api/pronote', async(req, res) => {
    console.log('SERVER: POST request sent')
    const response = await scraper();
    res.status(200).json(response);
    console.log('SERVER: Response sent');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`SERVER: Listening on port ${PORT}`);
});