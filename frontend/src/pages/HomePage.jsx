import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Box, Card, CardContent, CardMedia, CardActions, Typography, Button, Container, TextField } from '@mui/material';

const textStyles = {
  color: "text.primary",
  marginBottom: "8px",
  fontSize: '50px',
  fontWeight: "bold",
};

const headerContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(113, 0, 174, 0.5)',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '20px',
  marginTop: '20px',
};

export default function HomePage() {
  const [city, setCity] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLocalNews, setIsLocalNews] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);


  const apiKey = "5515506337d147efa47b0072334f7ff6";

  const fetchWorldNews = async (page = 1) => {
    setLoading(true);
    setError(null);
    setIsLocalNews(false);

    const apiUrl = `https://newsapi.org/v2/top-headlines?category=general&pageSize=20&page=${page}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      setNews(response.data.articles);
      setTotalResults(response.data.totalResults);
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalNews = async (page = 1) => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setIsLocalNews(true);

    const apiUrl = `https://newsapi.org/v2/everything?q=${city}&pageSize=20&page=${page}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      setNews(response.data.articles);
      setTotalResults(response.data.totalResults);
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to fetch news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorldNews();
  }, []);

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (isLocalNews) {
      fetchLocalNews(nextPage);
    } else {
      fetchWorldNews(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (page === 1) return;
    const previousPage = page - 1;
    setPage(previousPage);
    if (isLocalNews) {
      fetchLocalNews(previousPage);
    } else {
      fetchWorldNews(previousPage);
    }
  };



  return (
    <>
      <NavBar />
      <Container>
        <Box sx={headerContainerStyles}>
          <h2 style={textStyles}>{isLocalNews ? "Local News" : "World News"}</h2>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
          <TextField
            label="City"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#a64eff', color: '#fff', '&:hover': { backgroundColor: '#822ed6' } }} 
            onClick={fetchLocalNews}>
            Get Local News
          </Button>
          {isLocalNews && (
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#a64eff', color: '#fff', '&:hover': { backgroundColor: '#822ed6' } }} 
              onClick={() => fetchWorldNews(1)}>
              ←  Back to World News
            </Button>
          )}
        </Box>
        <div className="news-container">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {loading ? (
              <p>Loading news...</p>
            ) : error ? (
              <p>{error}</p>
            ) : news.length > 0 ? (
              news.map((article, index) => (
                <Card key={index} className="news-article" sx={{ marginBottom: 2, width: 'calc(50% - 16px)' }}>
                  {article.urlToImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.urlToImage}
                      alt={article.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={article.url} target="_blank" rel="noopener noreferrer">
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <p>No news available.</p>
            )}
          </Box>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#a64eff', color: '#fff', '&:hover': { backgroundColor: '#822ed6' } }}
            onClick={handlePreviousPage}
            disabled={page === 1}>
            ←  Previous
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#a64eff', color: '#fff', '&:hover': { backgroundColor: '#822ed6' } }}
            onClick={handleNextPage}
            disabled={news.length < 20}>
            Next  →
          </Button>
        </Box>
      </Container>
    </>
  );
}