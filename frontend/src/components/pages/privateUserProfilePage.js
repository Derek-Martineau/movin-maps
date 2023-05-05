import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Container } from 'react-bootstrap';
import axios from 'axios';

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [output, setOutput] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // handle logout button
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  function clearProfileDetails() {
    var profileDetails = document.getElementById("profile-details");
    profileDetails.innerHTML = "";
  }

  const url = "http://localhost:8081/user/editUser";

  // handle form field changes
  const [form, setValues] = useState({ userId: "", username: "", email: "", password: "" });
  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...form, [input.id]: input.value });
    if (!!errors[input]) {
      setErrors({
        ...errors,
        [input]: null,
      });
    }
  };
  
  // handle form submission with submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const { data: res } = await axios.put(url, form);
        const { accessToken } = res;
        //store token in localStorage
        localStorage.setItem("accessToken", accessToken);
        navigate("/privateuserprofile");
      } catch (error) {
        if (
          error.response &&
          error.response.status != 409 &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          window.alert(error.response.data.message);
        }
        if (error.response && error.response.status === 409) {
          setErrors({ name: "Username is taken, pick another" });
        }
      }
    }
  };
  
  // form validation checks
  const findFormErrors = () => {
    const { username, email, password } = form;
    const newErrors = {};
    // username validation checks
    if (!username || username === "") newErrors.name = "Input a valid username";
    else if (username.length < 6) newErrors.name = "Username must be at least 6 characters";
    // email validation checks
    if (!email || email === "") newErrors.email = "Input a valid email address";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Input a valid email address";
    // password validation checks
    if (!password || password === "") newErrors.password = "Input a valid password";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    return newErrors;
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'aliceblue';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const handleClick = (event) => {
    const { name } = event.target;
    setButtonName(name);
    setOutput(""); // add this line
    if (name === "Display") {
      setShowDetails(true);
    } else {
      setShowDetails(false);
      clearProfileDetails();
    }
  };
  const [buttonName, setButtonName] = useState("Display");

  return (
    <Container>
     <h1>Profile Page </h1>
{showDetails && (
  <div id="profile-details">
    <p>Username: {user.username}</p>
    <p>Email: {user.email}</p>
  </div>
  )}
<Button
  variant="primary"
  onClick={handleClick}
  name={showDetails ? "Hide" : "Display"}
  style={{ 
    backgroundColor: "initial",
    backgroundImage: "linear-gradient(to bottom right, #828282, #7d7d7d, #616161)",
    borderRadius: "3px",
    borderStyle: "none",
    boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
    color: "#fff",
    cursor: "pointer",
    display: "block",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "500",
    height: "100px",
    lineHeight: "60px",
    outline: "0",
    textAlign: "left",
    transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "manipulation",
    verticalAlign: "bottom",
    width: "230px",
    margin: "30px 0",
    marginLeft: "-280px"
  }}
>
  {showDetails ? "Hide" : "Display"} User Info
</Button>


      <Button variant="warning" 
      onClick={handleShow}
      style={{ 
        backgroundColor: "initial",
        backgroundImage: "linear-gradient(to bottom right, #828282, #7d7d7d, #616161)",
        borderRadius: "3px",
        borderStyle: "none",
        boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
        color: "#fff",
        cursor: "pointer",
        display: "block",
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: "500",
        height: "100px",
        lineHeight: "60px",
        outline: "0",
        textAlign: "left",
        transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        verticalAlign: "bottom",
        width: "230px",
        margin: "30px 0",
        marginLeft: "-280px"
      }}
        >
        Edit Profile
      </Button>
      <Button variant="danger" 
      onClick={handleLogout}
      style={{ 
        backgroundColor: "initial",
        backgroundImage: "linear-gradient(to bottom right, #828282, #7d7d7d, #616161)",
        borderRadius: "3px",
        borderStyle: "none",
        boxShadow: "rgba(245, 244, 247, .25) 0 1px 1px inset",
        color: "#fff",
        cursor: "pointer",
        display: "block",
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: "500",
        height: "100px",
        lineHeight: "60px",
        outline: "0",
        textAlign: "left",
        transition: "all .3s cubic-bezier(.05, .03, .35, 1)",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        verticalAlign: "bottom",
        width: "230px",
        margin: "30px 0",
        marginLeft: "-280px"
      }}>
        Logout
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                onChange={handleChange}
                placeholder={user.username}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                onChange={handleChange}
                placeholder={user.email}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={handleChange}
                placeholder="Password"
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PrivateUserProfile;


