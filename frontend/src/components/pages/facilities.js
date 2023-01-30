import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function Facilities() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/facilities',
      );
      setFacilities(result.data.data);
    }
    fetchData();
  }, []);

  return (
    <div>
        <h1>Facilities</h1>
      {facilities.map(facility => (
        <Card
        body
        outline
        color="success"
        className="mx-1 my-2"
        style={{ width: "30rem" }}
      >
        <Card.Body>
        <Card.Title>Facilities</Card.Title>
        <Card.Text>{facility.attributes.long_name}{facility.attributes.type}</Card.Text>
        </Card.Body>
      </Card>
      ))}
    </div>
  );
}

export default Facilities;