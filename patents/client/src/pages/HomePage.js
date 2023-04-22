import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

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

  return (
    <Container>
      <Box mt={6}>
        <Typography variant="h3" align="center"> AI Patent Explorer</Typography>
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          component={NavLink}
          to="/patents"
          variant="contained"
          color="primary"
        >
          Explore Patents
        </Button>
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          component={NavLink}
          to="/search_patents"
          variant="contained"
          color="primary"
        >
          Search Patents
        </Button>
      </Box>
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
