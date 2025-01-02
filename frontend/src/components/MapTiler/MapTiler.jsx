import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./MapTiler.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const usa = { lng: -118.24, lat: 40.71 };
  const zoom = 14;
  maptilersdk.config.apiKey = "mMj39F7ThXzLvZNBLlgW";

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [usa.lng, usa.lat],
      zoom: zoom,
    });
  }, [usa.lng, usa.lat, zoom]);
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}

// import React, { useEffect, useRef } from 'react';
// import maptiler from '@maptiler/sdk';
// import axios from 'axios';
// import './MapTiler.css';

// export default function MapTiler() {
//     const mapContainerRef = useRef(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             const apiKey = process.env.REACT_APP_MAPTILER_API_KEY;
//             const response = await axios.get(`https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`);
//             console.log(response.data);

//             const map = new maptiler.Map({
//                 container: mapContainerRef.current,
//                 style: response.data,
//                 center: [0, 0],
//                 zoom: 2,
//                 key: apiKey,
//             });
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="map-container">
//             <div ref={mapContainerRef} className="map"></div>
//         </div>
//     );
// }
