import React, { useState, useEffect } from 'react';

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
          padding: '4rem',
          color: 'white',
          fontSize: '1.3rem',
        }}
      >
        <h1 style={{ marginBottom: '2rem' }}>Welcome To Movin' Maps!</h1>
        <p style={{ marginBottom: '5rem', padding: '0 24rem' }}>
          The MBTA offers various transportation methods to the Massachusetts
          area through services such as the subway system, commuter rail, bus,
          and ferry routes. These transportation methods can be difficult to
          navigate. Movin’ Maps offers users real-time locations of transport
          through a GUI to make it easier to follow and plan routes. Users will
          be able to store their favorite routes on their account, filter the
          GUI to show specific routes or methods of transportation, and be
          recommended routes relative to their location. The status will display
          arrivals and alerts will update with delays.
        </p >
        
        <h2 style={{ marginBottom: '2rem' }}>Meet The Developers</h2>
        <p style={{ marginBottom: '4rem', padding: '0 24rem' }}>
          Movin' Maps was created for CSC300 the 
          Software Engineering course taught by Professor Allan Brockenbrogh at Salem State University. Movin’ Maps is a project created by a small team of 3 developers studying Computer Science. Together we entered Software Engineering knowing very little about the subject, we
          were able to learn about the complete life cycle of the software development process and
          how to version control such as Git to work as a team. Along with learning new Programming languages JavaScript and CSS we were also able to learn React. We hope you enjoy our project!
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
  <img src={'/derek.png'} alt="Derek" style={{ width: '300px', marginRight: '20rem'}} />
  <img src={'/dan.png'} alt="Dan" style={{ width: '300px', marginRight: '14rem' }} />
  <img src={'/archie.png'} alt="Archie" style={{ width: '300px', marginLeft: '10rem' }} />
</div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0rem',
          color: 'white',
          fontSize: '1.3rem',
        }}
      >
        {developers.map((developer, index) => (
          <div key={index} style={{ marginBottom: '0rem', padding: '3rem 10rem', marginRight: '6rem'}}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0rem' }}>
            
      </div>
            <p>
              {developer.fName} {developer.lName} <br /> {developer.projDescription}
            </p>
          </div>
        ))}
      </div>
    </>
  );


};

export default HomePage;