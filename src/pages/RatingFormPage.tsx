import { useState } from 'react';
import { Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const RatingFormPage = () => {
    // Defined textFieldStyles 
    const textFieldStyles = {
      backgroundColor: '#2D2F32',  // Adjust the background color if needed
      '& label.Mui-focused': {
        color: 'green',  // Changes the label color to green when focused
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'grey',  // Default border color
        },
        '&:hover fieldset': {
          borderColor: 'green',  // Border color changes to green on hover
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',  // Border color when the input is focused
        },
      }
    };
  
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
        <Typography variant="h2" style={{ color: 'white', fontWeight: 800, fontSize: '2.5em' }}>
          Leave a Review
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
          label="Select Restaurant"
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

        {/* Food Experience */}
        <TextField
          sx={textFieldStyles}
          variant="outlined"
          label="Describe Your Food Experience"
          multiline
          rows={3}
          fullWidth
          required
          value={foodExperience}
          onChange={(e) => setFoodExperience(e.target.value)}
        />

        {/* Service Experience */}
        <TextField
          sx={textFieldStyles}
          variant="outlined"
          label="Describe Your Service Experience"
          multiline
          rows={3}
          fullWidth
          required
          value={serviceExperience}
          onChange={(e) => setServiceExperience(e.target.value)}
        />

        {/* Cleanliness Experience */}
        <TextField
          sx={textFieldStyles}
          variant="outlined"
          label="Describe the Cleanliness of the Restaurant"
          multiline
          rows={3}
          fullWidth
          required
          value={cleanlinessExperience}
          onChange={(e) => setCleanlinessExperience(e.target.value)}
        />

{/* Recommend Checkbox */}
<FormControlLabel
          control={
            <Checkbox
              sx={textFieldStyles}
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
            />
          }
          label="Would you recommend this restaurant to a friend?"
        />

        {/* Additional Comments */}
        <TextField
          sx={textFieldStyles}
          label="Additional Comments or Suggestions"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
        />

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
          Submit Feedback
        </Button>
      </form>
    </div>
  );
};

export default RatingFormPage;
