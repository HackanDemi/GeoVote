import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchVoteData = async () => {
  const response = await axios.get("/api/vote-data"); // Adjust API endpoint
  return response.data; // { city, votes, lat, lng , zip}
};

const useVoteData = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const getData = async () => {
      const voteData = await fetchVoteData();
      setData(voteData);
    };
    getData();
  }, []);
  
  return data
};

export default useVoteData;
