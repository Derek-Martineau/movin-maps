import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devs = await getAllDevelopers();
        setDevelopers(devs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDevelopers();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = 'purple';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  function getAllDevelopers() {
    return fetch('http://localhost:8081/developer/getAll')
      .then(response => response.json())
      .then(data => {
        const developers = data.map(developer => ({
          fName: developer.fName,
          lName: developer.lName,
          projDescription: developer.projDescription
        }));
        return developers;
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h1>Welcome To Movin' Maps!</h1>
        <p>
          The MBTA offers various transportation methods to the Massachusetts
          area through services such as the subway system, commuter rail, bus,
          and ferry routes. These transportation methods can be difficult to
          navigate. Movin’ Maps offers users real-time locations of transport
          through a GUI to make it easier to follow and plan routes. Users will
          be able to store their favorite routes on their account, filter the
          GUI to show specific routes or methods of transportation, and be
          recommended routes relative to their location. The status will display
          arrivals and alerts will update with delays.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <h2>Developers</h2>
        {developers.map((developer, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <p>
              {developer.fName} {developer.lName}: {developer.projDescription}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
