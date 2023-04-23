import { useEffect, useState } from 'react';
import { Container, Divider, Link, Box, Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import PatentCard from '../components/PatentCard';
import neuralPathwaysImage from '../images/neural-pathways.jpg';
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
      <Box mt={12}>
        <Typography variant="h3" align="center"> AI Patent Explorer</Typography>
        <Box mt={2} maxWidth="200%" display="flex" justifyContent="center">
          <img src={neuralPathwaysImage} alt="Neural Pathways" style={{ width: '35%', height: 'auto' }} />
        </Box>
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          component={NavLink}
          to="/patents"
          variant="contained"
          color="primary"
        >
          Explore Patents
        </Button>
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
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
      {selectedPatentId && <PatentCard patentId={selectedPatentId} handleClose={() => setSelectedPatentId(null)} staticMode={false}/>}
      <Box mt={2} display="flex" justifyContent="center" alignItems="center">
      <h3>Featured patent:&nbsp;</h3>
      <h4>
       <NavLink to={`/patent/${featuredPatent.patent_id}`}>{featuredPatent.patent_title}</NavLink>
       <Link onClick={() => setSelectedPatentId(featuredPatent.patent_id)}>   (AI-score chart)  </Link>
       </h4>
       </Box>
      <Divider />
      <Box display="flex" justifyContent="center" alignItems="center">
      <h6><p>{appAuthor}</p></h6>
      </Box>
    </Container>
  );
};
