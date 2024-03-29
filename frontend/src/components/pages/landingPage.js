import React, {} from 'react'
import Card from 'react-bootstrap/Card';

document.body.style = 'background: black;';
const Landingpage = () => {

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem'}}>
        <Card style={{ width: '30rem' }} className="mx-2 my-2">
        <Card.Body>
          <Card.Title>Welcome to Movin Maps!</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Smooth out your commute with Movin Maps!</Card.Subtitle>
          <Card.Text>
          </Card.Text>
          <Card.Link href="/signup">Sign Up</Card.Link>
          <Card.Link href="/login">Login</Card.Link>
        </Card.Body>
      </Card>
      </div>
    )
}

export default Landingpage