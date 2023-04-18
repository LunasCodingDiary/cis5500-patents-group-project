const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/patents', routes.all_patents)

// Route 2 - register as GET 
app.get('/search/patents', routes.search_patents)

// Route 3 - register as GET 
app.get('/patent_viz', routes.patent_viz)

// Route 5 - register as GET 
app.get('/patent_map', routes.map)

// Route 6 - register as GET 
app.get('/patent_map/filter', routes.filter_map)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
