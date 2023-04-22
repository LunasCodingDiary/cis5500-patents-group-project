const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/author/:type', routes.author);
app.get('/random', routes.random);

app.get('/patents', routes.all_patents);
app.get('/search_patents', routes.search_patents);
app.get('/patent/:id', routes.patent)

app.get('/patent_map', routes.patent_map)
app.get('/patent_map_filter', routes.filter_map)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
