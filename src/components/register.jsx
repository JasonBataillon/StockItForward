import { useState } from 'react';
import { usePostUserMutation } from './usersSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [postUser] = usePostUserMutation();
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    try {
      const body = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };
      // Send registration request
      const response = await postUser(body).unwrap();
      console.log(response);
      localStorage.setItem('token', response.token);

      console.log('User registered:', response);
      setMessage(
        'Registration successful! You are now logged in. Redirecting...'
      );
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="logregi">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Register
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
};
export default Register;
