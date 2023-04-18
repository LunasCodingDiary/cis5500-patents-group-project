const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}


// ********************************************
//               GENERAL ROUTES
// ********************************************


// Route 3 (handler)
async function all_patents(req, res) {
   
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
            INNER JOIN Inventors ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= 2010
            AND A.pub_yr <= 2020
            ORDER BY A.pub_date DESC;
            LIMIT ${psize} OFFSET ${offset}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`
        SELECT C.patent_title, E.patent_id, A.pub_date, A.ai_score_ml, A.ai_score_evo,
            A.ai_score_nlp, A.ai_score_speach, A.ai_score_vision,
            A.ai_score_kr, A.ai_score_planning, A.ai_score_hardware
            FROM Assignee E INNER JOIN AllPatentsWithAICategory A ON E.patent_id = A.doc_id
            INNER JOIN Content C ON E.patent_id = C.patent_id
            INNER JOIN Inventors ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= 2010
            AND A.pub_yr <= 2020
            ORDER BY A.pub_date DESC;`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

async function patent_viz(req, res) {

    // use this league encoding in your query to furnish the correct results
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:
    const patId = req.query.id ? req.query.id : '10000080' 
    connection.query(`SELECT C.patent_title, I.raw_inventor_name_first, I.raw_inventor_name_last,
        I.inventor_sequence, E.assignee_organization, E.country, A.pub_date,
        C.patent_id, C.patent_abstract, A.ai_score_vision, A.ai_score_speach,
        A.ai_score_ml, A.ai_score_planning, A.ai_score_evo, A.ai_score_nlp,
        A.ai_score_hardware, A.ai_score_kr
        FROM AllPatentsWithAICategory A 
        INNER JOIN Content C ON C.patent_id = A.doc_id
        INNER JOIN Assignee E ON A.doc_id = E.patent_id
        INNER JOIN Inventors I ON A.doc_id = I.patent_id
        WHERE A.doc_id = ${patId};
        ORDER BY I.inventor_sequence;`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
}

async function map(req, res) {

    // use this league encoding in your query to furnish the correct results
    // This is the case where page is defined.
    // The SQL schema has the attribute OverallRating, but modify it to match spec! 
    // TODO: query and return results here:
    connection.query(`SELECT E.state, COUNT(DISTINCT A.doc_id) AS count
    FROM Assignee E JOIN AllPatentsWithAICategory A
    ON E.patent_id = A.doc_id
    WHERE E.country = 'United States' 
    AND E.assignee_organization is not NULL
    GROUP BY E.state
    ORDER BY count DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}



// ********************************************
//             SEARCH ROUTES
// ********************************************
async function filter_map(req, res) {

    // use this league encoding in your query to furnish the correct results
    // This is the case where page is defined.
    // The SQL schema has the attribute OverallRating, but modify it to match spec!
    // TODO: query and return results here:
    const pubFrom = req.query.pubFrom ? req.query.PubFrom : 2010
    const pubTo = req.query.pubTo ? req.query.PubTo : 2020
    const ml = req.query.ml ? req.query.ml : 0
    const evo = req.query.evo ? req.query.evo : 0
    const nlp = req.query.nlp ? req.query.nlp : 0
    const speach = req.query.speach ? req.query.speach : 0
    const vision = req.query.vision ? req.query.vision : 0
    const kr = req.query.kr ? req.query.kr : 0
    const planning = req.query.planning ? req.query.planning : 0
    const hardware = req.query.hardware ? req.query.hardware : 0

    connection.query(`SELECT E.state, COUNT(DISTINCT A.doc_id) AS count
    FROM Assignee E JOIN AllPatentsWithAICategory A
    ON E.patent_id = A.doc_id
    WHERE E.country = 'United States' 
    AND A.pub_yr >= ${pubFrom}
    AND A.pub_yr <= ${pubTo}
    AND A.predict50_ml >= ${ml}
    AND A.predict50_evo >= ${evo}
    AND A.predict50_nlp >= ${nlp}
    AND A.predict50_speach >= ${speach}
    AND A.predict50_vision >= ${vision}
    AND A.predict50_kr >= ${kr}
    AND A.predict50_planning >= ${planning}
    AND A.predict50_hardware >= ${hardware}
    AND E.assignee_organization is not NULL
    GROUP BY E.state
    ORDER BY count DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


// Route 7 (handler)
async function search_patents(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

    const pubFrom = req.query.pubFrom ? req.query.PubFrom : 2010
    const pubTo = req.query.pubTo ? req.query.PubTo : 2020
    const fName = req.query.firstName ? req.query.FirstName : ''
    const lName = req.query.lastName ? req.query.LastName : ''
    const org = req.query.org ? req.query.opurg : ''
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
            INNER JOIN Inventors ON E.patent_id = I.patent_id
            WHERE A.pub_yr >= ${pubFrom}
            AND A.pub_yr <= ${pubTo}
            AND I.raw_inventor_name_first like '${fName}%'
            AND I.raw_inventor_name_last like '%${lName}%'
            AND E.assignee_organization like '%${org}%'
            AND A.predict50_ml >= ${ml}
            AND A.predict50_evo >= ${evo}
            AND A.predict50_nlp >= ${nlp}
            AND A.predict50_speach >= ${speach}
            AND A.predict50_vision >= ${vision}
            AND A.predict50_kr >= ${kr}
            AND A.predict50_planning >= ${planning}
            AND A.predict50_hardware >= ${hardware}
            AND C.patent_title like '%${title}%'
            ORDER BY A.pub_date DESC;
            LIMIT ${pagesize} OFFSET ${offset}`, function (error, results) {

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
    hello,
    jersey,
    all_matches,
    all_players,
    match,
    player,
    search_matches,
    search_players
}