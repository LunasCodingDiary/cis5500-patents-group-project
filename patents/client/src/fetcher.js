// import config from './config.json'

// const getAllPatents = async (page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/patents?page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPatentSearch = async (page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/search_patents?page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPatentViz = async (id) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/patent/${patentId}`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPatentMap = async (id) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/patent_map`, {
//         method: 'GET',
//     })
//     return res.json()
// }

// const getPatentMapFilter = async (home, away, page, pagesize) => {
//     var res = await fetch(`http://${config.server_host}:${config.server_port}/patent_map_filter?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
//         method: 'GET',
//     })
//     return res.json()
// }
