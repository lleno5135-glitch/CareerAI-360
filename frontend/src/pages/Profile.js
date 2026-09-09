import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data.user);
      setFormData(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user.firstName} {user.lastName}</h1>
        <p>{user.email}</p>
      </div>

      <div className="profile-content">
        {!editing ? (
          <div className="profile-view">
            <div className="profile-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Industry:</strong> {user.industry || 'Not specified'}</p>
              <p><strong>Experience:</strong> {user.yearsOfExperience || 'Not specified'} years</p>
              <p><strong>Career Goal:</strong> {user.careerGoal || 'Not specified'}</p>
            </div>
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="profile-edit">
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Career Goal</label>
              <input
                type="text"
                name="careerGoal"
                value={formData.careerGoal || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="button-group">
              <button onClick={handleSaveProfile} className="btn-save">Save</button>
              <button onClick={() => setEditing(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
