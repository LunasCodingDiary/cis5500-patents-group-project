import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack,Typography } from '@mui/material';

const config = require('../config.json');

export default function PatentPage() {
  const { id } = useParams();

  const [patentData, setPatentData] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/patent?id=${id}`)
      .then(res => res.json())
      .then(resJson => setPatentData(resJson));
  }, [id]);

  if (!patentData) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4">{patentData.title}</Typography>
        <Typography variant="subtitle1">Publication number: {patentData.publication_number}</Typography>
        <Typography variant="subtitle1">Publication date: {patentData.publication_date}</Typography>
        <Typography variant="subtitle1">Inventors: {patentData.inventors.join(', ')}</Typography>
        <Typography variant="subtitle1">Assignee: {patentData.assignee}</Typography>
        <Typography variant="body1" paragraph>{patentData.abstract}</Typography>
      </Stack>
    </Container>
  );
}