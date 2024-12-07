import { Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';

const RatingFormPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [foodExperience, setFoodExperience] = useState('');
  const [serviceExperience, setServiceExperience] = useState('');
  const [cleanlinessExperience, setCleanlinessExperience] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', color: 'white' }}>
      <header style={{ marginBottom: '20px' }}>
        <Typography
          variant="h2"
          style={{
            color: 'white',
            fontFamily: '"Zilla Slab", "Inter", sans-serif',
            fontWeight: 800,
            fontSize: '2.5em',
          }}
        >
          Leave a Review
        </Typography>
      </header>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Email Input */}
        <TextField
          variant="outlined"
          label="Your Email"
          type="email"
          fullWidth
          required
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />




