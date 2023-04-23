import { useEffect, useState } from 'react';
import { Box, Container, Button, Dialog } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PatentCard from '../components/PatentCard';

const config = require('../config.json');

export default function PatentsPage() {
  const [patents, setPatents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // for open the PatentCard
  const [selectedPatentId, setSelectedPatentId] = useState(null);

  useEffect(() => {
    const pageSize = 10;
    const pageNumber = 1;
    fetch(`http://${config.server_host}:${config.server_port}/patents?pagesize=${pageSize}&page=${pageNumber}`)
      .then(res => res.json())
      .then(resJson => setPatents(resJson.results));
  }, []);

  const handleOpenDialog = (patentId) => {
    setSelectedPatentId(patentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container sx={flexFormat}>
      {patents.map((patent) =>
        <Box
          key={patent.patent_id}
          p={3}
          m={2}
          style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
        >
          <h4><NavLink to={`/patent/${patent.patent_id}`}>{patent.patent_title}</NavLink></h4>
          <Button variant="contained" onClick={() => handleOpenDialog(patent.patent_id)}>
            AI Score Chart
          </Button>
          <p>Patent id: {patent.patent_id}</p>
        </Box>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {selectedPatentId && <PatentCard patentId={selectedPatentId} />}
      </Dialog>
    </Container>
  );
}
