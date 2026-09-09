import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resume.css';

const ResumeBuilder = () => {
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    personalDetails: { name: '', email: '', phone: '' },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/resumes/my-resume', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResume(response.data.data.resume);
      setFormData(response.data.data.resume);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    }
  };

  const handlePersonalDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleSaveResume = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/resumes/create',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(response.data.data.resume);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resume) {
      alert('Please save your resume first');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/resumes/${resume._id}/analyze`,
        { courseType: 'general' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysis(response.data.data.analysis);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-builder">
      <h1>Resume Builder</h1>

      <div className="builder-container">
        <div className="builder-form">
          <h2>Personal Details</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.personalDetails?.name || ''}
              onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.personalDetails?.email || ''}
              onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
              placeholder="Your email"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.personalDetails?.phone || ''}
              onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
              placeholder="Your phone number"
            />
          </div>

          <div className="button-group">
            <button onClick={handleSaveResume} disabled={loading} className="btn-save">
              {loading ? 'Saving...' : 'Save Resume'}
            </button>
            <button onClick={handleAnalyzeResume} disabled={loading} className="btn-analyze">
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="analysis-panel">
            <h3>Resume Analysis</h3>
            <div className="ats-score">
              <h4>ATS Score: {analysis.atsScore}%</h4>
            </div>
            <div className="optimization-tips">
              <h4>Optimization Tips:</h4>
              <ul>
                {analysis.optimization?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
