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
    document.body.style.backgroundColor = 'darkgray    ';

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
    backgroundImage: `url('/HomePageOverlay.jpeg')`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center bottom',
    height: '80vh',
    width: '99.2vw', // Set width to 100vw to match screen width
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.3rem',
    padding: '0 3rem',
    paddingBottom: '27rem',

  }}
>
  <h1 style={{ marginBottom: '2rem' }}>Welcome To Movin' Maps!</h1>
  <p style={{ marginBottom: '5rem' }}>
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

  backgroundPosition: 'center bottom',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '1.3rem',
  padding: '0 3rem',

}}
>

        <h2 style={{ marginBottom: '2rem' }}>Meet The Developers</h2>
        <p style={{ marginBottom: '4rem', padding: '0 24rem' }}>
          Movin' Maps was created for CSC300 the 
          Software Engineering course taught by Professor Allan Brockenbrogh at Salem State University. Movin’ Maps is a project created by a small team of 3 developers studying Computer Science. Together we entered Software Engineering knowing very little about the subject, we
          were able to learn about the complete life cycle of the software development process and
          how to version control such as Git to work as a team. Along with learning new Programming languages JavaScript and CSS we were also able to learn React. We hope you enjoy our project!
        </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '30px' }}>
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {developers.length >= 1 && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10rem' }}>
        <img src={'/derek.png'} alt="Derek" style={{ width: '225px', height: '270px', borderRadius: '50%' }} />
        <p style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{developers[0].fName} {developers[0].lName}</p>
      </div>
    )}
    {developers.length >= 2 && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10rem' }}>
        <img src={'/dan.png'} alt="Dan" style={{ width: '225px', height: '270px', borderRadius: '50%' }} />
        <p style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{developers[1].fName} {developers[1].lName}</p>
      </div>
    )}
    {developers.length >= 3 && (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10rem' }}>
        <img src={'/archie.png'} alt="Archie" style={{ width: '225px', height: '270px', borderRadius: '50%' }} />
        <p style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{developers[2].fName} {developers[2].lName}</p>
      </div>
    )}
  </div>
  <div style={{ flex: '1', marginLeft: '2rem' }}>
    {developers.map((developer, index) => (
      <div key={index} style={{ marginBottom: '18rem', padding: '5rem 5rem', marginRight: '6rem', color: 'white'}}>
        <p>
          {developer.projDescription}
        </p>
      </div>
    ))}
  </div>
</div>

    </>
  );


};

export default HomePage;