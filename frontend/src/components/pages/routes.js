import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { Form } from 'react-bootstrap';

function RoutesPage() {
  // State for storing routes data, route names, and the selected route
  const [routes, setRoutes] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch routes data from the MBTA API when the component mounts
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

  useEffect(() => {
    document.body.style.backgroundColor = 'darkgray';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  // Handle the selection of a route from the dropdown
  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selected = routes.find(route => route.attributes.long_name === selectedName);
    setSelectedRoute(selected);
  };

  // Render the RoutesPage component
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1 style={{ color: 'Gray' }}>Routes</h1>
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
        // Only display the route card if no route is selected or if the current route matches the selected one
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