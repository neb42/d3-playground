const fetch = require('node-fetch');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use('/files', express.static('data'));
app.listen(port, () => console.info(`Listening on port ${port}`));
