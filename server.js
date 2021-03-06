const express = require('express');
const path = require('path');

const app = express(); 

// Serve only the static files form the dist directory
app.use(express.static('./dist/light-bootstrap-dashboard-angular2-master'));

app.get('*/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/light-bootstrap-dashboard-angular2-master'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);