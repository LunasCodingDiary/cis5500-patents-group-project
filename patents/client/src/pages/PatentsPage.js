import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function PatentsPage() {
  const [patents, setPatents] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/api/patents`)
      .then(res => res.json())
      .then(resJson => setPatents(resJson));
  }, []);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container sx={flexFormat}>
      {patents.map((patent) =>
        <Box
          key={patent.id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          <h4><NavLink to={`/patent/${patent.id}`}>{patent.title}</NavLink></h4>
          <p>Publication number: {patent.publication_number}</p>
        </Box>
      )}
    </Container>
  );
}
