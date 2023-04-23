import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const config = require('../config.json');

export default function PatentMapPage (){
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/patent_map`)
      .then(res => res.json())
      .then(resJson => setMapData(resJson.results));
  }, []);

  const onEachFeature = (feature, layer) => {
    const stateData = mapData.find(data => data.state === feature.properties.NAME);
    if (stateData) {
      layer.bindPopup(`<strong>${stateData.state}</strong><br/>Patents: ${stateData.count}`);
    }
  };

  const mapStyle = {
    fillColor: 'white',
    weight: 2,
    opacity: 1,
    color: 'blue',
    fillOpacity: 0.7
  };

  return (
    <div>
      <h1>Patent Map</h1>
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={`../../public/gz_2010_us_040_00_500k.json`}
          style={mapStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};