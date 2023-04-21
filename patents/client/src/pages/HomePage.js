import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import PatentCard from '../components/PatentCard';
const config = require('../config.json');

export default function HomePage() {
  const [featuredPatent, setFeaturedPatent] = useState({});
  const [appAuthor, setAppAuthor] = useState('');
  const [selectedPatentId, setSelectedPatentId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setFeaturedPatent(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(resText => setAppAuthor(resText));
  }, []);

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
      {selectedPatentId && <PatentCard patentId={selectedPatentId} handleClose={() => setSelectedPatentId(null)} />}
      <h2>Check out your featured patent:&nbsp;
        <Link onClick={() => setSelectedPatentId(featuredPatent.patent_id)}>{featuredPatent.title}</Link>
      </h2>
      <Divider />
      <h2>Top Patents</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_patents`} columns={patentColumns} />
      <Divider />
      <p>{appAuthor}</p>
    </Container>
  );
};
