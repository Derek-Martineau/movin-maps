import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  // handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = 'aliceblue';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);


  
  return (
    <div className="container" style={{ margin: 0, padding: 0 }}>
      <div className="row" style={{ margin: 0, padding: 0 }}>
        <div className="col-md-3">
        <div className="list-group" style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
 
 /*Profile Details button*/
  <button
  type="button"
  className="list-group-item list-group-item-action active"
  onClick={() => setShowDetails(true)}
  style={{ 
    backgroundColor: "initial",
  backgroundImage: "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
  borderRadius: "3px",
  borderStyle: "none",
  boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
  color: "#fff",
  cursor: "pointer",
  display: "inline-block",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontWeight: "500",
  height: "100px",
  lineHeight: "60px",
  marginLeft: "-13px",
  outline: "0",
  textAlign: "center",
  transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  verticalAlign: "bottom",
  width: "250px"
    }}
  >
    Profile Details
  </button>

/*Profile editUser button*/
  <button
 type="button"
 className="list-group-item list-group-item-action active"
 onClick={handleShow}
 style={{ 
  backgroundColor: "initial",
  backgroundImage: "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
  borderRadius: "3px",
  borderStyle: "none",
  boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
  color: "#fff",
  cursor: "pointer",
  display: "inline-block",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontWeight: "500",
  height: "100px",
  lineHeight: "60px",
  marginLeft: "-13px",
  outline: "0",
  textAlign: "center",
  transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  verticalAlign: "bottom",
  width: "250px"
    }}
  >
    Edit Profile
  </button>

  /*Delete Profile button*/
  <button
   type="button"
   className="list-group-item list-group-item-action active"
   onClick={handleShow}
   style={{ 
    backgroundColor: "initial",
    backgroundImage: "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
    borderRadius: "3px",
    borderStyle: "none",
    boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
    color: "#fff",
    cursor: "pointer",
    display: "inline-block",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "500",
    height: "100px",
    lineHeight: "60px",
    marginLeft: "-13px",
    outline: "0",
    textAlign: "center",
    transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
    verticalAlign: "bottom",
    width: "250px"
    }}
  >
    Delete Profile
  </button>

/*Find My User button*/
  <button
  type="button"
  className="list-group-item list-group-item-action active"
  onClick={handleShow}
  style={{ 
    backgroundColor: "initial",
    backgroundImage: "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
    borderRadius: "3px",
    borderStyle: "none",
    boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
    color: "#fff",
    cursor: "pointer",
    display: "inline-block",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "500",
    height: "100px",
    lineHeight: "60px",
    marginLeft: "-13px",
    outline: "0",
    textAlign: "center",
    transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
    verticalAlign: "bottom",
    width: "250px"
    }}
  >
    Find My User
  </button>

</div>

/*logout button*/
<button
  type="button"
  className="list-group-item list-group-item-action active"
  onClick={handleShow}
  style={{ 
    backgroundColor: "initial",
  backgroundImage: "linear-gradient(to bottom right, #48c6ef, #6f86d6)",
  borderRadius: "3px",
  borderStyle: "none",
  boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
  color: "#fff",
  cursor: "pointer",
  display: "inline-block",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  fontWeight: "500",
  height: "100px",
  lineHeight: "60px",
  marginLeft: "-13px",
  outline: "0",
  textAlign: "center",
  transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  verticalAlign: "bottom",
  width: "250px"
  }}
>
  Log Out
</button>
<Modal
  show={show}
  onHide={handleClose}
  backdrop="static"
  keyboard={false}
>
  <Modal.Header closeButton>
    <Modal.Title>Log Out</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={handleLogout}>
      Yes
    </Button>
  </Modal.Footer>
</Modal>
        </div>
        
        <div className="col-md-9" 
        style={{ 
          position: "absolute", 
          bottom: "245px", 
          left: "250px", 
          boxShadow: "1px 1px 10px rgba(0, 0, 0, 1)", 
          padding: "50px",
          width: "800px",
          height: "600px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",}}>
  {showDetails && (
    <div>
      <h3>
        Welcome<span className="username"> @{user.username}</span>
      </h3>
      <h3>
        Your userId in mongo db is<span className="userId"> {user.userId}</span>
      </h3>
      <h3>
        Your registered email is<span className="email"> {user.email}</span>
      </h3>
    </div>
    
  )}
</div>

      </div>
    </div>
  );
  
};

export default PrivateUserProfile;


