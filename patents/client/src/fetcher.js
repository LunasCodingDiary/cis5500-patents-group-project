import config from './config.json'

const getAllPatents = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/patents?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPatentSearch = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/patents?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPatentViz = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/patent_viz?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPatentMap = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/patent_map?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPatentMapFilter = async (home, away, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/patent_map/filter?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}