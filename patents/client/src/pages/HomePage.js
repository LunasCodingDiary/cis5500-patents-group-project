import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import LazyTable from '../components/LazyTable';
import PatentCard from '../components/PatentCard';
const config = require('../config.json');

export default function HomePage() {
  const [featuredPatent, setFeaturedPatent] = useState({});
  const [appAuthor, setAppAuthor] = useState('');
  const [selectedPatentId, setSelectedPatentId] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [patentIndex, setPatentIndex] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setFeaturedPatent(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resText => setAppAuthor(resText));
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/search/patents`, {
        params: {
          title: keyword,
          page: patentIndex || 1
        }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const patentColumns = [
    {
      field: 'title',
      headerName: 'Patent Title',
      renderCell: (row) => <Link onClick={() => setSelectedPatentId(row.patent_id)}>{row.title}</Link>
    },
    {
      field: 'applicants',
      headerName: 'Applicants',
    },
    {
      field: 'application_date',
      headerName: 'Application Date'
    },
  ];

  return (
    <Container>
      <h2>Search Patents</h2>
      <TextField
        label="Enter keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Enter patent index (optional)"
        value={patentIndex}
        onChange={(e) => setPatentIndex(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSearch} variant="contained" color="primary">Search</Button>
      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result.patent_id} className="search-result">
            <Link onClick={() => setSelectedPatentId(result.patent_id)}>{result.patent_title}</Link>
          </div>
        ))}
      </div>
      <Divider />
      {selectedPatentId && <PatentCard patentId={selectedPatentId} handleClose={() => setSelectedPatentId(null)} />}
      <h2>Check out your featured patent:&nbsp;
        <Link onClick={() => setSelectedPatentId(featuredPatent.patent_id)}>{featuredPatent.title}</Link>
      </h2>
      <Divider />
      <p>{appAuthor}</p>
    </Container>
  );
};
