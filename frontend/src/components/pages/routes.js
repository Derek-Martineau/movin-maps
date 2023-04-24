import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { Form } from 'react-bootstrap';

function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('https://api-v3.mbta.com/routes');
      setRoutes(result.data.data);

      // Extract route names
      const names = result.data.data.map(route => route.attributes.long_name);
      setRouteNames(names);
    }
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selected = routes.find(route => route.attributes.long_name === selectedName);
    setSelectedRoute(selected);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1 style={{ color: 'white' }}>Routes</h1>
      <Form>
        <Form.Group controlId="routeSelect">
          <Form.Label style={{ color: 'white' }}>Select Route</Form.Label>
          <Form.Control as="select" style={{ width: '15rem' }} onChange={handleSelectChange}>
            <option value="">Select a route</option>
            {routeNames.map((name, index) => (
              <option key={index}>{name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      {routes.map(route => (
        (!selectedRoute || route === selectedRoute) && (
          <Card
            body
            bg="white"
            text="black"
            outline
            color="black"
            className="mx-1 my-2"
            style={{ width: "30rem" }}
          >
            <Card.Body>
              <Card.Title>{route.attributes.long_name}</Card.Title>
              <Card.Text>{route.attributes.type}</Card.Text>
            </Card.Body>
          </Card>
        )
      ))}
    </div>
  );
}

export default RoutesPage;
