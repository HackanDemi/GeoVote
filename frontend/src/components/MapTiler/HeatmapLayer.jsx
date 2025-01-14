import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import axios from 'axios';

const HeatmapLayer = ({ pollId }) => { // Accept pollId as a prop
  const map = useMap(); // useMap is referring to the Leaflet map

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/polls/random/');
        const data = response.data; // Expect the response
        console.log(data);

        const heatPoints = [[ // Create a single heat point from the data
          data.latitude, // Latitude
          data.longitude, // Longitude
          data.id, // Intensity (adjust as needed)
        ]];
        console.log(heatPoints);
        const heatLayer = L.heatLayer(heatPoints, { // Within the heatLayer I can choose the color gradient (yellow/orange/red)
          radius: 25, // Adjust radius
          blur: 50,   // Adjust blur for smoothness
          maxZoom: 10,
        });

        heatLayer.addTo(map); // addTo is a class that allows heatLayer to be a Layer on top of the map

        return () => {
          map.removeLayer(heatLayer);
        };
      } catch (error) {
        console.error('Error fetching location data:', error); // When the axios request to the API doesn't receive data 
      }
    };

    fetchData();
  }, [map, pollId]); // Add pollId to the dependency array

  return null; // This component doesn't render anything
};

export default HeatmapLayer;
