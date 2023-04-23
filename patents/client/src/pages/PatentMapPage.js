import React, { useEffect, useState} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const config = require('../config.json');

export default function PatentMapPage (){
  const [mapData, setMapData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [filters, setFilters] = useState({
    ml: false,
    evo: false,
    nlp: false,
    speach: false,
    vision: false,
    kr: false,
    planning: false,
    hardware: false,
  });

  // initial loading
  useEffect(() => {
    fetchPatentData(filters);
  }, []);

  const fetchPatentData = (filters) => {
    const queryString = Object.keys(filters)
      .map((key) => `${key}=${filters[key] ? 1 : 0}`)
      .join("&");
    fetch(
      `http://${config.server_host}:${config.server_port}/patent_map_filter?pubFrom=2010&pubTo=2020&${queryString}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setMapData(resJson.results);
      });
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/gz_2010_us_040_00_500k.json`)
      .then((res) => res.json())
      .then((data) => {setGeoJsonData(data);
      });
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPatentData(filters);
  };

  const onEachFeature = (feature, layer) => {
   const stateAbbr = getStateAbbreviation(feature.properties.NAME); //matching abbree and state names
   const stateData = mapData.find((data) => data.state === stateAbbr);
   if (stateData) {
      layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br/>Patents: ${stateData.count}`);
    } else {
      layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br/>Patents: 0`);
    }
  };

  const mapStyle = {
    fillColor: 'purple',
    weight: 3,
    opacity: 0.7,
    color: 'pastel blue',
    fillOpacity: 0.1
  };

  return (
    <div>
      <h3>Patent Map</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            name="ml"
            checked={filters.ml}
            onChange={handleChange}
          />
          Machine Learning
        </label>
        <label>
          <input
            type="checkbox"
            name="evo"
            checked={filters.evo}
            onChange={handleChange}
          />
          Evolutionary
        </label>
        <label>
          <input
            type="checkbox"
            name="speach"
            checked={filters.speach}
            onChange={handleChange}
          />
          Speech
        </label>
        <label>
          <input
            type="checkbox"
            name="nlp"
            checked={filters.nlp}
            onChange={handleChange}
          />
          NLP
        </label>
        <label>
          <input
            type="checkbox"
            name="vision"
            checked={filters.vision}
            onChange={handleChange}
          />
          Vision
        </label>
        <label>
        <input
            type="checkbox"
            name="kr"
            checked={filters.kr}
            onChange={handleChange}
          />
          Knowledge
        </label>
        <label>
        <input
            type="checkbox"
            name="hardware"
            checked={filters.hardware}
            onChange={handleChange}
          />
          Hardware
        </label>
        <label>
          <input
            type="checkbox"
            name="planning"
            checked={filters.planning}
            onChange={handleChange}
          />
          Planning
        </label>
        <button type="submit">Apply Filters</button>
      </form>
      {geoJsonData && mapData.length > 0 ? (
      <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          key={mapData.length}
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