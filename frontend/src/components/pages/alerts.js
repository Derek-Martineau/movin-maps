import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/alerts?sort=banner&filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE',
      );
      setAlerts(result.data.data);
    }
    fetchData();
  }, []);

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
      <h1 style={{color: 'white'}}>Recent Alerts</h1>
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

export default Alerts;
