import { useState } from 'react';
import { Typography, Button, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';

const RatingPage = () => {
  const [userEmail, setUserEmail] = useState(''); // Email state
  const [foodRating, setFoodRating] = useState(3); // Food rating state
  const [locationRating, setLocationRating] = useState(3); // Location rating state
  const [cleanlinessRating, setCleanlinessRating] = useState(3); // Cleanliness rating state
  const [serviceRating, setServiceRating] = useState(3); // Service rating state
  const [valueForMoneyRating, setValueForMoneyRating] = useState(3); // Value for money rating state
  const [menuVarietyRating, setMenuVarietyRating] = useState(3); // Menu variety rating state
  const [waitTimeRating, setWaitTimeRating] = useState(3); // Wait time rating state
  const [staffRating, setStaffRating] = useState(3); // Staff rating state
  const [overallSatisfactionRating, setOverallSatisfactionRating] = useState(3); // Overall satisfaction rating state
  const [selectedRestaurant, setSelectedRestaurant] = useState(''); // Restaurant selection state

  // Define textFieldStyles for styling
  const textFieldStyles = {
    backgroundColor: '#2D2F32',
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'green',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', color: 'white' }}>
      <header style={{ marginBottom: '20px' }}>
        <Typography variant="h2" style={{ color: 'white', fontWeight: 800, fontSize: '2.5em' }}>
          Rate Our Services
        </Typography>
        <Typography variant="body1" style={{ color: 'white', marginTop: '20px', fontSize: '1.2em' }}>
          Thank you for dining with us! We appreciate the time you’ve taken to share your feedback with us. Your thoughts help us continue to improve and provide you with the best possible experience.
        </Typography>
      </header>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Email Input */}
        <TextField
          sx={textFieldStyles}
          variant="outlined"
          label="Your Email"
          type="email"
          fullWidth
          required
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        {/* Restaurant Selection */}
        <TextField
          sx={textFieldStyles}
          select
          SelectProps={{ native: true }}
          variant="outlined"
          fullWidth
          required
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value="">-- Select a Restaurant --</option>
          <option value="stephanies@example.com">Stephanie's - Market c</option>
          <option value="scottys@example.com">Scotty's Market By Salem's</option>
          <option value="aubonpain@example.com">Au Bon Pain At Skibo Café</option>
          <option value="rohrcafe@example.com">Rohr Café - La Prima</option>
          <option value="schatz@example.com">Schatz Dining Room</option>
          <option value="defercafe@example.com">De Fer Coffee & Tea At Maggie Murph Café</option>
          <option value="exchange@example.com">The Exchange</option>
          <option value="capitalgrains@example.com">Capital Grains - Rohr Commons</option>
          <option value="milliescreamery@example.com">Millie's Coffee 'n' Creamery - Rohr Commons</option>
          <option value="stackddessert@example.com">Stack'd Dessert Bar</option>
          <option value="stackdunderground@example.com">Stack'd Underground</option>
          <option value="entropy@example.com">Entropy+</option>
          <option value="elgallo@example.com">El Gallo De Oro</option>
          <option value="revolutionnoodle@example.com">Revolution Noodle</option>
          <option value="tasteofindia@example.com">Taste Of India</option>
          <option value="trueburger@example.com">True Burger</option>
          <option value="hunanexpress@example.com">Hunan Express</option>
          <option value="edgecafe@example.com">The Edge Cafe & Market</option>
          <option value="tahini@example.com">Tahini</option>
          <option value="eggshoppe@example.com">Egg Shoppe - Grubhub Only</option>
          <option value="laprimaespresso@example.com">La Prima Espresso</option>
          <option value="redhawkcoffee@example.com">Redhawk Coffee</option>
          <option value="zebralounge@example.com">Zebra Lounge</option>
          <option value="ciaobella@example.com">Ciao Bella</option>
          <option value="crispandcrust@example.com">Crisp And Crust</option>
          <option value="nourish@example.com">Nourish</option>
          <option value="buildpizza@example.com">Build Pizza - Rohr Commons</option>
          <option value="forbesavesubs@example.com">Forbes Avenue Subs - Rohr Commons</option>
          <option value="rohrcommons@example.com">Rohr Commons - Tepper Eatery</option>
          <option value="teppertaqueria@example.com">Tepper Taqueria</option>
          <option value="teppertaqueriaexp@example.com">Tepper Taqueria Express</option>
          <option value="wildbluesushi@example.com">Wild Blue Sushi - Ruge Atrium</option>
          <option value="shakesmart@example.com">Shake Smart</option>
          <option value="eatevenings@example.com">E.a.t. (evenings At Tepper) - Rohr Commons</option>
          <option value="urbanrevolution@example.com">Urban Revolution - Grubhub Only</option>
          <option value="testconcept@example.com">Test Concept</option>
          <option value="tartantruck@example.com">Tartan Food Truck - Mr. Bulgogi</option>
        </TextField>

        {/* Food Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the food? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={foodRating}
            onChange={(e) => setFoodRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Location Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the location? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={locationRating}
            onChange={(e) => setLocationRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>


        {/* Cleanliness Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the cleanliness? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={cleanlinessRating}
            onChange={(e) => setCleanlinessRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Service Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the service? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={serviceRating}
            onChange={(e) => setServiceRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Value for Money */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the value for money of your meal? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={valueForMoneyRating}
            onChange={(e) => setValueForMoneyRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Menu Variety Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How satisfied were you with the variety of options on the menu? (1 = Poor, 5 = Excellent)
          </Typography>
          <RadioGroup
            value={menuVarietyRating}
            onChange={(e) => setMenuVarietyRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Wait Time Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How would you rate the wait time for your food? (1 = Too long, 5 = Perfect)
          </Typography>
          <RadioGroup
            value={waitTimeRating}
            onChange={(e) => setWaitTimeRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Staff Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            How friendly and welcoming was the staff? (1 = Not friendly, 5 = Very friendly)
          </Typography>
          <RadioGroup
            value={staffRating}
            onChange={(e) => setStaffRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Overall Satisfaction Rating */}
        <div>
          <Typography variant="h6" style={{ color: 'white' }}>
            Overall, how satisfied were you with your experience? (1 = Very dissatisfied, 5 = Very satisfied)
          </Typography>
          <RadioGroup
            value={overallSatisfactionRating}
            onChange={(e) => setOverallSatisfactionRating(parseInt(e.target.value))}
            row
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio style={{ color: 'green' }} />}
                label={value}
                labelPlacement="bottom"
              />
            ))}
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '10px 20px',
            marginTop: '20px',
          }}
        >
          Submit Rating
        </Button>
      </form>
    </div>
  );
};

export default RatingPage;
