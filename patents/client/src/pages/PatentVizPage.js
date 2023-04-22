import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack,Typography } from '@mui/material';
import PatentCard from './PatentCard';

const config = require('../config.json');

export default function PatentPage() {
  const { id } = useParams();

  const [patentData, setPatentData] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/patent/${id}`)
      .then(res => res.json())
      .then(resJson => setPatentData(resJson.results));
  }, [id]);

  if (!patentData) {
    return <div>Loading...</div>;
  }

  const inventors = patentData.map(inventor => `${inventor.raw_inventor_name_first} ${inventor.raw_inventor_name_last}`).join(', ');

  return (
    <Container>
      <Stack direction="column" spacing={2}>
      <Typography variant="h4">{patentData[0].patent_title}</Typography>
        <Typography variant="subtitle1">Patent id: {patentData[0].patent_id}</Typography>
        <Typography variant="subtitle1">Publication date: {patentData[0].pub_date}</Typography>
        <Typography variant="subtitle1">Inventors: {inventors}</Typography>
        <Typography variant="subtitle1">Assignee: {patentData[0].assignee_organization}</Typography>
        <Typography variant="subtitle1">Country: {patentData[0].country}</Typography>
        <Typography variant="body1" paragraph>{patentData[0].patent_abstract}</Typography>
        <Typography variant="subtitle1">AI Scores:</Typography>
        <PatentCard patentId={id} />
        <Typography variant="body1">Vision: {patentData[0].ai_score_vision}</Typography>
        <Typography variant="body1">Speech: {patentData[0].ai_score_speach}</Typography>
        <Typography variant="body1">Machine Learning: {patentData[0].ai_score_ml}</Typography>
        <Typography variant="body1">Planning: {patentData[0].ai_score_planning}</Typography>
        <Typography variant="body1">Evolutionary Computing: {patentData[0].ai_score_evo}</Typography>
        <Typography variant="body1">Natural Language Processing: {patentData[0].ai_score_nlp}</Typography>
        <Typography variant="body1">Hardware: {patentData[0].ai_score_hardware}</Typography>
        <Typography variant="body1">Knowledge Representation: {patentData[0].ai_score_kr}</Typography>
      </Stack>
    </Container>
  );
}