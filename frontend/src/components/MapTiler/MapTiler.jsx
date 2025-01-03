import React, { useRef, useEffect, useState } from "react";
// Importing React and hooks (useRef, useEffect, useState) from the 'react' library.

import * as maptilersdk from "@maptiler/sdk";
// Importing the entire MapTiler SDK as 'maptilersdk'.

import "@maptiler/sdk/dist/maptiler-sdk.css";
// Importing the CSS file for MapTiler SDK to style the map.

import L from "leaflet";
// Importing the Leaflet library for map functionalities.

import "leaflet.heat";
// Importing the Leaflet heatmap plugin for creating heatmaps.

import useVoteData from "./useVoteData";
// Importing a custom hook 'useVoteData' to fetch vote data.

import "./MapTiler.css";
// Importing the CSS file for styling the MapTiler component.

const mockVoteData = [
  { city: "New York", votes: 35, lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", votes: 25, lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", votes: 15, lat: 41.8781, lng: -87.6298 },
  { city: "Houston", votes: 5, lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix", votes: 20, lat: 33.4484, lng: -112.074 },
];
// Creating a mock data array with city names, votes, and their geographical coordinates.

export default function Map() {
  const mapContainer = useRef(null);
  // Creating a reference to the map container element.

  const map = useRef(null);
  // Creating a reference to the map instance.

  const usaCenter = { lng: -98.35, lat: 39.5 };
  // Defining the approximate center coordinates of the USA.

  const zoom = 4;
  // Setting the zoom level to 4 to show the entire USA.

  // const voteData = useVoteData();
  // Commented out: Using the custom hook to fetch vote data and will reimplement when API is working.

  useEffect(() => {
    if (map.current) return;
    // If the map instance already exists, do nothing to prevent re-initialization.

    maptilersdk.config.apiKey = "mMj39F7ThXzLvZNBLlgW";
    // Setting the MapTiler API key for authentication.

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [usaCenter.lng, usaCenter.lat],
      zoom: zoom,
    });
    // Initializing the MapTiler map with the specified container, style, center, and zoom level.

    map.current.on('load', () => {
      const heatPoints = mockVoteData.map((city) => {
        let intensity = 0;

        if (city.votes >= 30) {
          intensity = 1; // Red
        } else if (city.votes >= 20) {
          intensity = 0.7; // Orange
        } else if (city.votes >= 10) {
          intensity = 0.4; // Yellow
        } else {
          intensity = 0.1; // Green
        }

        return [city.lat, city.lng, intensity];
      });
      // Mapping the mock vote data to create heatmap points with intensity based on the number of votes.

      L.heatLayer(heatPoints, { radius: 25 }).addTo(map.current);
      // Adding the heatmap layer to the map with the specified radius.
    });
  }, []);
  // Using the useEffect hook to initialize the map and add the heatmap layer when the component mounts.

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
// Returning the JSX to render the map container with the specified CSS classes.
// import React, { useRef, useEffect, useState } from "react";
// import * as maptilersdk from "@maptiler/sdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";
// import L from "leaflet"; // Leaflet for heatmap
// import "leaflet.heat"; // Correct import for Leaflet heatmap plugin
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import useVoteData from "./useVoteData"; // Custom hook to fetch vote data

// import "./MapTiler.css";

// export default function Map() {
//   const mapContainer = useRef(null);
//   const [heatData, setHeatData] = useState([]);

//   const usa = { lng: -118.24, lat: 40.71 };
//   const zoom = 14;

//   // Fetch vote data
//   const voteData = useVoteData();

//   useEffect(() => {
//     if (voteData.length > 0) {
//       const heatPoints = voteData.map((city) => {
//         let intensity = 0;

//         if (city.votes >= 30) {
//           intensity = 1; // Red
//         } else if (city.votes >= 20) {
//           intensity = 0.7; // Orange
//         } else if (city.votes >= 10) {
//           intensity = 0.4; // Yellow
//         } else {
//           intensity = 0.1; // Green
//         }

//         return [city.lat, city.lng, intensity];
//       });

//       setHeatData(heatPoints);
//     }
//   }, [voteData]);

//   return (
//     <MapContainer center={usa} zoom={zoom} className="map-wrap">
//         <TileLayer
//           url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=mMj39F7ThXzLvZNBLlgW"
//         />
//       <Marker position={usa}>
//         <Popup>USA</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }


// import React, { useRef, useEffect } from "react";
// import * as maptilersdk from "@maptiler/sdk";
// import "@maptiler/sdk/dist/maptiler-sdk.css";
// import "./MapTiler.css";

// export default function Map() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const usaCenter = { lng: -98.35, lat: 39.50 }; // Approximate center of the USA
//   const zoom = 4; // Lower zoom level to show the entire USA
//   const heatMapLayer = [
//     {lng: -110.35, lat: 49.50},
//     {lng: -110.35, lat: 49.50},
//     {lng: -110.35, lat: 49.50},
//     {lng: -110.35, lat: 49.50},
//     {lng: -110.35, lat: 49.50},
//     {lng: -110.35, lat: 49.50},
// ]

//   maptilersdk.config.apiKey = "mMj39F7ThXzLvZNBLlgW";

//   useEffect(() => {
//     if (map.current) return; // stops map from initializing more than once

//     map.current = new maptilersdk.Map({
//       container: mapContainer.current,
//       style: maptilersdk.MapStyle.STREETS,
//       center: [usaCenter.lng, usaCenter.lat],
//       zoom: zoom,
//     });
//   }, [usaCenter.lng, usaCenter.lat, zoom]);

//   return (
//     <div className="map-wrap">
//       <div ref={mapContainer} className="map" />
//     </div>
//   );
// }