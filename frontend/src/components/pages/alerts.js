// Import required libraries and components
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

// Alerts component definition
function Alerts() {
  // State for storing alerts fetched from the API
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts using useEffect (executes once on component mount)
  useEffect(() => {
    // Define fetchData as an async function for fetching data from the API
    async function fetchData() {
      // Make a GET request to the API and store the response
      const result = await axios(
        'https://api-v3.mbta.com/alerts?sort=banner&filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE',
      );
      // Update the alerts state with the fetched data
      setAlerts(result.data.data);
    }
    // Call fetchData function
    fetchData();
  }, []);

  // Render the Alerts component
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        backgroundImage: `url('/AlertPageOverlay.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '150vh'
      }}
    >
      {/* Header for the alerts */}
      <h1 style={{color: 'white'}}>Recent Alerts</h1>
      {/* Container for displaying the alerts */}
      <div 
        style={{
          height: '50vh',
          width: '100%',
          overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Loop through the alerts and render a Card component for each */}
        {alerts.map(alert => (
          <Card
            body
            bg="white"
            text="black"
            outline
            color="black"
            className="mx-2 my-4"
            style={{width: "30rem"}}
            key={alert.id}
          >
            {/* Alert details (header and description) */}
            <Card.Body>
              <Card.Title>{alert.attributes.header}</Card.Title>
              <Card.Text>{alert.attributes.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Export the Alerts component
export default Alerts;