import React, { useEffect, useRef } from 'react';
import maptiler from '@maptiler/sdk'; // The MapTiler SDK is used to create and display the map inside the div with the mapContainerRef reference
import axios from 'axios';

export default function MapTiler() {
    const mapContainerRef = useRef(null); // A ref is created using useRef to reference the map container

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
        <div>
            <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
}