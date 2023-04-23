import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const config = require('../config.json');

export default function PatentMapPage (){
  const [mapData, setMapData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/patent_map_filter?pubFrom=2010&pubTo=2020&ml=0&evo=0&nlp=0&speach=0&vision=0&kr=0&planning=0&hardware=0`)
      .then(res => res.json())
      .then(resJson => {
        setMapData(resJson.results);
    });
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/gz_2010_us_040_00_500k.json`)
      .then((res) => res.json())
      .then((data) => {setGeoJsonData(data);
        console.log('geo data:', data.features);
      });
  }, []);

  const onEachFeature = (feature, layer) => {
   const stateAbbr = getStateAbbreviation(feature.properties.NAME);
   const stateData = mapData.find((data) => data.state === stateAbbr);
   if (stateData) {
      layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br/>Patents: ${stateData.count}`);
    } else {
      layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br/>Patents: 0`);
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
      {geoJsonData && mapData.length > 0 ? (
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={geoJsonData}
          style={mapStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer> ): (
      <p>Loading map...</p>
    )}
    </div>
  );
};

// helper functions
const states = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function getStateAbbreviation(fullName) {
  return Object.keys(states).find((abbr) => states[abbr] === fullName);
}