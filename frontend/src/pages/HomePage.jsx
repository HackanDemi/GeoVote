import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Card, CardContent, CardActions, Typography, Button, Container } from '@mui/material';

export default function HomePage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us', 
            apiKey: '5515506337d147efa47b0072334f7ff6',
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <NavBar />
      <Container>
        <div className="news-container">
          <h2>Local News</h2>
          {news.length > 0 ? (
            news.map((article, index) => (
              <Card key={index} className="news-article" sx={{ marginBottom: 2 }}>
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
            <p>Loading news...</p>
          )}
        </div>
      </Container>
    </>
  );
}
