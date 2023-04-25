import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { Form } from 'react-bootstrap';

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('https://api-v3.mbta.com/facilities');
      setFacilities(result.data.data);

      // Extract facility names
      const names = result.data.data.map(facility => facility.attributes.long_name);
      setFacilityNames(names);
    }
    fetchData();
  }, []);
  
  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selected = facilities.find(facility => facility.attributes.long_name === selectedName);
    setSelectedFacility(selected);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        backgroundImage: `url('/facilities.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh'
      }}
    >
      <h1 style={{ color: 'black' }}>Facilities</h1>
      <Form>
        <Form.Group controlId="facilitySelect">
          <Form.Label style={{ color: 'black' }}>Select Facility</Form.Label>
          <Form.Control as="select" style={{ width: '15rem' }} onChange={handleSelectChange}>
            <option value="">Select a facility</option>
            {facilityNames.map((name, index) => (
              <option key={index}>{name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      {facilities.map(facility => (
        (!selectedFacility || facility === selectedFacility) && (
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
              <Card.Title>{facility.attributes.long_name}</Card.Title>
              <Card.Text>{facility.attributes.type}</Card.Text>
            </Card.Body>
          </Card>
        )
      ))}
    </div>
  );
}

export default Facilities;
