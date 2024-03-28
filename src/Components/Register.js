import React, { useState } from 'react';
import '../Components/Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'option1', 
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.username) {
      isValid = false;
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      isValid = false;
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      isValid = false;
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.phone) {
      isValid = false;
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      isValid = false;
      newErrors.phone = 'Phone number must be at least 10 digits long';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let demo = JSON.stringify(formData);
    console.log(demo);
    console.log(JSON.parse(demo));

    fetch("http://localhost:8080/api/Registration", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: demo,
    });

    if (validateForm()) {
      
      
      alert('Registration successful!');
    } else {
      alert('Plese give Correct information!')
    }
  };

  const handleLogin = () => {
    navigate('/Login');
  };

  const { username, password, email, phone, role } = formData;

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
          />

          <label htmlFor="phone">Phone No</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleChange}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="button" onClick={handleLogin}>
            Login
          </button>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
