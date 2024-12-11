import transporter from '../util/emailTransporter.js';

const restaurantEmails = {
  "stephanies@example.com": "Stephanie's - Market c",
  "scottys@example.com": "Scotty's Market By Salem's",
  "aubonpain@example.com": "Au Bon Pain At Skibo Café",
  "rohrcafe@example.com": "Rohr Café - La Prima",
  "schatz@example.com": "Schatz Dining Room",
  "defercafe@example.com": "De Fer Coffee & Tea At Maggie Murph Café",
  "exchange@example.com": "The Exchange",
  "capitalgrains@example.com": "Capital Grains - Rohr Commons",
  "milliescreamery@example.com": "Millie's Coffee 'n' Creamery - Rohr Commons",
  "stackddessert@example.com": "Stack'd Dessert Bar",
  "stackdunderground@example.com": "Stack'd Underground",
  "entropy@example.com": "Entropy+",
  "elgallo@example.com": "El Gallo De Oro",
  "revolutionnoodle@example.com": "Revolution Noodle",
  "tasteofindia@example.com": "Taste Of India",
  "trueburger@example.com": "True Burger",
  "hunanexpress@example.com": "Hunan Express",
  "edgecafe@example.com": "The Edge Cafe & Market",
  "tahini@example.com": "Tahini",
  "eggshoppe@example.com": "Egg Shoppe - Grubhub Only",
  "laprimaespresso@example.com": "La Prima Espresso",
  "redhawkcoffee@example.com": "Redhawk Coffee",
  "zebralounge@example.com": "Zebra Lounge",
  "ciaobella@example.com": "Ciao Bella",
  "crispandcrust@example.com": "Crisp And Crust",
  "nourish@example.com": "Nourish",
  "buildpizza@example.com": "Build Pizza - Rohr Commons",
  "forbesavesubs@example.com": "Forbes Avenue Subs - Rohr Commons",
  "rohrcommons@example.com": "Rohr Commons - Tepper Eatery",
  "teppertaqueria@example.com": "Tepper Taqueria",
  "teppertaqueriaexp@example.com": "Tepper Taqueria Express",
  "wildbluesushi@example.com": "Wild Blue Sushi - Ruge Atrium",
  "shakesmart@example.com": "Shake Smart",
  "eatevenings@example.com": "E.a.t. (evenings At Tepper) - Rohr Commons",
  "urbanrevolution@example.com": "Urban Revolution - Grubhub Only",
  "testconcept@example.com": "Test Concept",
  "tartantruck@example.com": "Tartan Food Truck - Mr. Bulgogi"
};

export const sendFeedbackEmail = async (req, res) => {
  const {
    userEmail,
    selectedRestaurant,
    wouldRecommend,
    foodExperience,
    serviceExperience,
    cleanlinessExperience,
    additionalComments,
  } = req.body;

  // Validate request data
  if (!userEmail || !selectedRestaurant || !foodExperience || !serviceExperience || !cleanlinessExperience) {
    return res.status(400).send({ message: 'All required fields must be filled.' });
  }

  try {
    // Get the restaurant name and email
    const restaurantName = restaurantEmails[selectedRestaurant];
    if (!restaurantName) {
      return res.status(404).send({ message: 'Invalid restaurant selected.' });
    }

    // Construct the email subject and body
    const subject = `New Feedback for ${restaurantName}`;
    const body = `
      Feedback received for ${restaurantName}:

      - User Email: ${userEmail}
      - Food Experience: ${foodExperience}
      - Service Experience: ${serviceExperience}
      - Cleanliness Experience: ${cleanlinessExperience}
      - Would Recommend: ${wouldRecommend ? 'Yes' : 'No'}
      - Additional Comments: ${additionalComments}
    `;

    // Send the email
    await transporter.sendMail({
      from: userEmail,
      to: selectedRestaurant, // Email of the selected restaurant
      subject: subject,
      text: body,
    });

    // Respond with success
    res.status(200).send({ message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send feedback email.' });
  }
};
