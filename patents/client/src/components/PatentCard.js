import { useEffect, useState, useMemo } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const config = require('../config.json');

export default function PatentCard({ patentId, handleClose = () => {}, staticMode }) {
  const [patentData, setPatentData] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/patent/${patentId}`)
      .then(res => res.json())
      .then(resJson => setPatentData(resJson.results[0]))
  }, [patentId]);

  const chartData = useMemo(() => {
    return[
    { name: 'Machine Learning', value: patentData.ai_score_ml },
    { name: 'Evolutionary', value: patentData.ai_score_evo },
    { name: 'NLP', value: patentData.ai_score_nlp },
    { name: 'Speech', value: patentData.ai_score_speach },
    { name: 'Vision', value: patentData.ai_score_vision },
    { name: 'Knowledge', value: patentData.ai_score_kr },
    { name: 'Planning', value: patentData.ai_score_planning },
    { name: 'Hardware', value: patentData.ai_score_hardware }
  ];
},[patentData]);

  const content =  (
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <div style={{ margin: 20 }}>
          <ResponsiveContainer height={350}>
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="AI Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Close
        </Button>
      </Box>
  );

  if (staticMode || !patentId) {
    return content;
  }

  return (
    <Modal
      open={!!patentId}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {content}
    </Modal>
  );
}
