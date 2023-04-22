import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function PatentCard({ patentId, handleClose }) {
  const [patent, setPatent] = useState({});

  useEffect(() => {
    if (patentId) {
      fetch(`http://${config.server_host}:${config.server_port}/patents/${patentId}`)
        .then(res => res.json())
        .then(resJson => setPatent(resJson));
    }
  }, [patentId]);

  return (
    <Modal
      open={!!patentId}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{patent.title}</h1>
        <h4>Publication Number: {patent.publication_number}</h4>
        <h4>Publication Date: {patent.publication_date}</h4>
        <h4>Inventors: {patent.inventors}</h4>
        <h4>Assignee: {patent.assignee}</h4>
        <h4>Abstract:</h4>
        <p>{patent.abstract}</p>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}