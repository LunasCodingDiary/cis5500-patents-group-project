import React, { useState} from 'react';
import { Box, Container, TextField, FormControlLabel, Checkbox, Typography, Button, Grid, Pagination } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function SearchPatentPage() {
  const [patents, setPatents] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    pubFrom: '2010',
    pubTo: '2020',
    fName: '',
    lName: '',
    org: '',
    ml: 0,
    evo: 0,
    nlp: 0,
    speach: 0,
    vision: 0,
    kr: 0,
    planning: 0,
    hardware: 0,
    title: '',
    page: 1,
    pagesize: 10,
  });

  const searchPatents = () => {
    const query = new URLSearchParams(searchCriteria).toString();
    fetch(`http://${config.server_host}:${config.server_port}/search_patents?${query}`)
      .then(res => res.json())
      .then(resJson => setPatents(resJson.results));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchPatents();
  };

  const handleChange = (event) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.checked ? 1 : 0 });
  };

  const handlePageChange = (event, value) => {
    setSearchCriteria({ ...searchCriteria, page: value });
  };

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Search Patents</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Publication From" variant="outlined" name="pubFrom" type="number" value={searchCriteria.pubFrom} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Publication To" variant="outlined" name="pubTo" type="number" value={searchCriteria.pubTo} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="First Name" variant="outlined" name="fName" value={searchCriteria.fName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Last Name" variant="outlined" name="lName" value={searchCriteria.lName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Organization" variant="outlined" name="org" value={searchCriteria.org} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Title" variant="outlined" name="title" value={searchCriteria.title} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Page" variant="outlined" name="page" type="number" value={searchCriteria.page} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Page Size" variant="outlined" name="pagesize" type="number" value={searchCriteria.pagesize} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">AI Categories</Typography>
          </Grid>
          {['ml', 'evo', 'nlp', 'speach', 'vision', 'kr', 'planning', 'hardware'].map((category) => (
            <Grid key={category} item xs={6} sm={4} md={3} lg={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={searchCriteria[category] === 1}
                    onChange={handleCheckboxChange}
                    name={category}
                    color="primary"
                  />
                }
                label={category.toUpperCase()}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">Search</Button>
          </Grid>
        </Grid>
      </Box>
      <Container sx={flexFormat} mt={3}>
        {patents.map((patent) => (
          <Box
            key={patent.patent_id}
            p={3}
            m={2}
            style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
          >
            <h4>
              <NavLink to={`/patent/${patent.patent_id}`}>{patent.patent_title}</NavLink>
            </h4>
            <p>Publication date: {patent.pub_date}</p>
          </Box>
        ))}
      </Container>
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(patents.length / searchCriteria.pagesize)}
          page={searchCriteria.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
}