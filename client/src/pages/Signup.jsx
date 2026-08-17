import React from 'react';
import { useState } from 'react';
import { register } from '../services/auth.api.js';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData);

  const handleSubmit = async(e) => {
    e.preventDefault() ;
    try {
        const res = await   register(formData) ;
        console.log(res);
    } catch (error) {
        console.log(error)
    }


  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          onChange={handleChange}
          type="text"
          id="name"
          name="name"
          value={formData.name}
        />
        <label>Email</label>
        <input
          onChange={handleChange}
          type="email"
          id="email"
          name="email"
          value={formData.email}
        />
        <label>Mobile No</label>
        <input
          onChange={handleChange}
          type="number"
          id="mobile"
          name="mobileNo"
          value={formData.mobileNo}
        />
        <label>Pasword</label>
        <input
          onChange={handleChange}
          type="password"
          id="password"
          name="password"
          value={formData.password}
        />
        <label>Confirm Password </label>
        <input
          onChange={handleChange}
          type="password"
          id="ConfirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
        />
        <button>Register</button>
      </form>
    </div>
  );
}

export default Signup;
