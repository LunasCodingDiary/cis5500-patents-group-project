const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /author/:type
const author = async function(req, res) {
    const name = 'Evam Roberts, Lu Fang, Qi Zhang';
    if (req.params.type === 'name') {
      res.send(`Created by ${name}`);
    } else {
      res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name'.`);
    }
  }

  // Route 2: GET /random
const random = async function(req, res) {
      connection.query(`
      SELECT C.patent_title, E.patent_id, A.pub_date, A.ai_score_ml, A.ai_score_evo,
            A.ai_score_nlp, A.ai_score_speach, A.ai_score_vision,
            A.ai_score_kr, A.ai_score_planning, A.ai_score_hardware
            FROM Assignee E INNER JOIN AllPatentsWithAICategory A ON E.patent_id = A.doc_id
            INNER JOIN Content C ON E.patent_id = C.patent_id
            INNER JOIN Inventors I ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= 2019
            AND A.pub_yr <= 2020
            ORDER BY RAND()
            LIMIT 1;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
      }
    });
  }

// ********************************************
//               BASIC FUNCTIONAL ROUTES
// ********************************************


// Route 3: GET /patents
const all_patents = async function (req, res) {
   
    const page = req.query.page
    const psize = req.query.pagesize ? req.query.pagesize : 10
    /*declare a variable that stores the offset, this is used
    to calculate the correct page of rows we want to return*/
    var offset = 0
    if (req.query.page != 1) {
        offset = (page - 1) * 10
    }
    // use this league encoding in your query to furnish the correct results
    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:

        connection.query(`
            SELECT C.patent_title, E.patent_id, A.pub_date, A.ai_score_ml, A.ai_score_evo,
            A.ai_score_nlp, A.ai_score_speach, A.ai_score_vision,
            A.ai_score_kr, A.ai_score_planning, A.ai_score_hardware
            FROM Assignee E INNER JOIN AllPatentsWithAICategory A ON E.patent_id = A.doc_id
            INNER JOIN Content C ON E.patent_id = C.patent_id
            INNER JOIN Inventors I ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= 2010
            AND A.pub_yr <= 2020
            GROUP BY A.doc_id
            LIMIT ${psize} OFFSET ${offset};`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        connection.query(`
        SELECT C.patent_title, E.patent_id, A.pub_date, A.ai_score_ml, A.ai_score_evo,
            A.ai_score_nlp, A.ai_score_speach, A.ai_score_vision,
            A.ai_score_kr, A.ai_score_planning, A.ai_score_hardware
            FROM Assignee E INNER JOIN AllPatentsWithAICategory A ON E.patent_id = A.doc_id
            INNER JOIN Content C ON E.patent_id = C.patent_id
            INNER JOIN Inventors I ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= 2010
            AND A.pub_yr <= 2020
            GROUP BY A.doc_id;`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// ROUTE 4: GET /patent/:id
const patent = async function (req, res) {
    const patId = req.params.id
    connection.query(`SELECT C.patent_title, I.raw_inventor_name_first, I.raw_inventor_name_last,
        I.inventor_sequence, E.assignee_organization, E.country, A.pub_date,
        C.patent_id, C.patent_abstract, A.ai_score_vision, A.ai_score_speach,
        A.ai_score_ml, A.ai_score_planning, A.ai_score_evo, A.ai_score_nlp,
        A.ai_score_hardware, A.ai_score_kr
        FROM AllPatentsWithAICategory A 
        INNER JOIN Content C ON C.patent_id = A.doc_id
        INNER JOIN Assignee E ON A.doc_id = E.patent_id
        INNER JOIN Inventors I ON A.doc_id = I.patent_id
        WHERE A.doc_id = '${patId}'
        ORDER BY I.inventor_sequence;`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

// ********************************************
//               MAP ROUTES
// ********************************************

// ROUTE 5: GET /patent_map
const patent_map = async function (req, res) {
    connection.query(`SELECT E.state, COUNT(DISTINCT A.doc_id) AS count
    FROM Assignee E JOIN AllPatentsWithAICategory A
    ON E.patent_id = A.doc_id
    WHERE E.country = 'United States' 
    AND E.assignee_organization is not NULL
    GROUP BY state;`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// ROUTE 6: GET /patent_map_filter
const  patent_map_filter = async function(req, res) {
    const pubFrom = req.query.pubFrom ? req.query.pubFrom : 2010
    const pubTo = req.query.pubTo ? req.query.pubTo : 2020
    const ml = req.query.ml ? req.query.ml : 0
    const evo = req.query.evo ? req.query.evo : 0
    const nlp = req.query.nlp ? req.query.nlp : 0
    const speach = req.query.speach ? req.query.speach : 0
    const vision = req.query.vision ? req.query.vision : 0
    const kr = req.query.kr ? req.query.kr : 0
    const planning = req.query.planning ? req.query.planning : 0
    const hardware = req.query.hardware ? req.query.hardware : 0

    connection.query(`SELECT E.state AS state, COUNT(DISTINCT A.doc_id) AS count
    FROM Assignee E JOIN AllPatentsWithAICategory A
    ON E.patent_id = A.doc_id
    WHERE E.country = 'United States' 
    AND A.pub_yr >= ${pubFrom}
    AND A.pub_yr <= ${pubTo}
    AND A.predict50_ml >= ${ml}
    AND A.predict50_evo >= ${evo}
    AND A.predict50_nlp >= ${nlp}
    AND A.predict50_speech >= ${speach}
    AND A.predict50_vision >= ${vision}
    AND A.predict50_kr >= ${kr}
    AND A.predict50_planning >= ${planning}
    AND A.predict50_hardware >= ${hardware}
    AND E.assignee_organization is not NULL
    GROUP BY state;`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// ********************************************
//               SEARCH ROUTE
// ********************************************

// ROUTE 7: GET /search_patents
const  search_patents = async function(req, res) {
    const pubFrom = req.query.pubFrom ? req.query.pubFrom : 2010
    const pubTo = req.query.pubTo ? req.query.pubTo : 2020
    const fName = req.query.fName ? req.query.fName : ''
    const lName = req.query.lName ? req.query.lName : ''
    const org = req.query.org ? req.query.org : ''
    const ml = req.query.ml ? req.query.ml : 0
    const evo = req.query.evo ? req.query.evo : 0
    const nlp = req.query.nlp ? req.query.nlp : 0
    const speach = req.query.speach ? req.query.speach : 0
    const vision = req.query.vision ? req.query.vision : 0
    const kr = req.query.kr ? req.query.kr : 0
    const planning = req.query.planning ? req.query.planning : 0
    const hardware = req.query.hardware ? req.query.hardware : 0
    const title = req.query.title ? req.query.title : ''
    const page = req.query.page ? req.query.page : 1
    const pagesize = req.query.pagesize ? req.query.pagesize : 10
    var offset = 0

    if (!isNaN(page)
        && !isNaN(pagesize)) {
        if (page != 1) {
            offset = (page - 1) * 10
        }
        //console.log("Entering Query")
        connection.query(`SELECT C.patent_title, E.patent_id, A.pub_date, A.ai_score_ml, A.ai_score_evo,
            A.ai_score_nlp, A.ai_score_speach, A.ai_score_vision,
            A.ai_score_kr, A.ai_score_planning, A.ai_score_hardware
            FROM Assignee E INNER JOIN AllPatentsWithAICategory A ON E.patent_id = A.doc_id
            INNER JOIN Content C ON E.patent_id = C.patent_id
            INNER JOIN Inventors I ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= ${pubFrom}
            AND A.pub_yr <= ${pubTo}
            AND I.raw_inventor_name_first like '${fName}%'
            AND I.raw_inventor_name_last like '%${lName}%'
            AND E.assignee_organization like '%${org}%'
            AND A.predict50_ml >= ${ml}
            AND A.predict50_evo >= ${evo}
            AND A.predict50_nlp >= ${nlp}
            AND A.predict50_speech >= ${speach}
            AND A.predict50_vision >= ${vision}
            AND A.predict50_kr >= ${kr}
            AND A.predict50_planning >= ${planning}
            AND A.predict50_hardware >= ${hardware}
            AND C.patent_title like '%${title}%'
            GROUP BY A.doc_id
            LIMIT ${pagesize} OFFSET ${offset};`, function (error, results) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }

        })

    } else {
        const results = []
        res.json({ results: results })
    }
}

module.exports = {
    author,
    random,
    all_patents,
    patent,
    patent_map,
    patent_map_filter,
    search_patents
}