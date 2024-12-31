import React, { useEffect, useRef } from 'react';
import maptiler from '@maptiler/sdk';
import axios from 'axios';
import './MapTiler.css';

export default function MapTiler() {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const apiKey = process.env.REACT_APP_MAPTILER_API_KEY;
            const response = await axios.get(`https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`);
            console.log(response.data);

            const map = new maptiler.Map({
                container: mapContainerRef.current,
                style: response.data,
                center: [0, 0],
                zoom: 2,
                key: apiKey,
            });
        };

        fetchData();
    }, []);

    return (
        <div className="map-container">
            <div ref={mapContainerRef} className="map"></div>
        </div>
    );
}