import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Stack,Typography,Box } from '@mui/material';
import PatentCard from '../components/PatentCard';
import googlePatentImage from '../images/google_patent.jpg';

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
  let googlePatentPart = 'https://patents.google.com/patent/'
  let patentNumberPart = patentData[0].patent_number
  let googlePatentURL = googlePatentPart.concat("", patentNumberPart)

  const inventors = patentData.map(inventor => `${inventor.raw_inventor_name_first} ${inventor.raw_inventor_name_last}`).join(', ');

  return (
    <Container>
      <Stack direction="column" spacing={2}>
      <Typography variant="h4">{patentData[0].patent_title}</Typography>
      <Stack direction="row" spacing={4}>
        <Stack direction="column" spacing={2}>
        <Typography variant="subtitle1">Patent number: {patentData[0].patent_number}</Typography>
        <Typography variant="subtitle1">Publication date: {patentData[0].pub_date}</Typography>
        <Typography variant="subtitle1">Inventors: {inventors}</Typography>
        <Typography variant="subtitle1">Assignee: {patentData[0].assignee_organization}</Typography>
        <Typography variant="subtitle1">Country: {patentData[0].country}</Typography>
        <Typography variant="body1" paragraph>{patentData[0].patent_abstract}</Typography>
        <a href={googlePatentURL} target="_blank" rel="noreferrer">
        <img src={googlePatentImage} alt="Google Patents" style={{ width: '14%', height: 'auto' }}/>
      </a>

        <Box mt={4} display="flex" justifyContent="center">        
        <Typography variant="h6">AI Scores</Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center"> 
        <Stack direction="column" spacing={4}>
        <PatentCard patentId={id} staticMode={true} />
        <Typography variant="body1">Vision: {patentData[0].ai_score_vision}</Typography>
        <Typography variant="body1">Speech: {patentData[0].ai_score_speach}</Typography>
        <Typography variant="body1">Machine Learning: {patentData[0].ai_score_ml}</Typography>
        <Typography variant="body1">Planning: {patentData[0].ai_score_planning}</Typography>
        <Typography variant="body1">Evolutionary Computing: {patentData[0].ai_score_evo}</Typography>
        <Typography variant="body1">Natural Language Processing: {patentData[0].ai_score_nlp}</Typography>
        <Typography variant="body1">Hardware: {patentData[0].ai_score_hardware}</Typography>
        <Typography variant="body1">Knowledge Representation: {patentData[0].ai_score_kr}</Typography>
        
         
        
        </Stack>
        </Box>
      </Stack>
      </Stack>
      </Stack>
    </Container>
  );
}