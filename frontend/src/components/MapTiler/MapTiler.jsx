import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapLayer from "./HeatmapLayer";
import "./MapTiler.css";

const Map = () => {
  const center = [40.73, -73.935]; // lat, lng
  const zoom = 12;
  // const mockVoteData = [
  //   { city: "New York", votes: 35, lat: 40.7128, lng: -74.006 },
  //   { city: "Los Angeles", votes: 25, lat: 34.0522, lng: -118.2437 },
  //   { city: "Chicago", votes: 15, lat: 41.8781, lng: -87.6298 },
  //   { city: "Houston", votes: 5, lat: 29.7604, lng: -95.3698 },
  //   { votes: 20, lat: 33.4484, lng: -112.074 },
  // ];
  
  // data={mockVoteData}
  
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer />
    </MapContainer>
  );
};

export default Map;

