import React, { useEffect } from 'react';
import maptiler from '@maptiler/sdk';
import axios from 'axios';

export default function MapTiler() {
    useEffect(() => {
        const fetchData = async () => {
            const apiKey = process.env.REACT_APP_MAPTILER_API_KEY;
            const response = await axios.get(`https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`);
            console.log(response.data);
        };

        fetchData();
    }, []);

    return (
        <div>MapTiler</div>
    );
}
