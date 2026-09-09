import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    completedChallenges: 0,
    ongoingChallenges: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/challenges/my-challenges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const challs = response.data.data.challenges || [];
      setChallenges(challs);
      
      setStats({
        totalChallenges: challs.length,
        completedChallenges: challs.filter(c => c.status === 'completed').length,
        ongoingChallenges: challs.filter(c => c.status === 'in_progress').length,
        averageScore: challs.reduce((acc, c) => acc + (c.averageScore || 0), 0) / challs.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalChallenges}</h3>
          <p>Total Challenges</p>
        </div>
        <div className="stat-card">
          <h3>{stats.ongoingChallenges}</h3>
          <p>Ongoing</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedChallenges}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{Math.round(stats.averageScore)}%</h3>
          <p>Average Score</p>
        </div>
      </div>

      <div className="challenges-section">
        <h2>My Challenges</h2>
        <div className="challenges-list">
          {challenges.length === 0 ? (
            <p>No challenges yet. Start a new challenge to begin!</p>
          ) : (
            challenges.map(challenge => (
              <div key={challenge._id} className="challenge-card">
                <h3>{challenge.courseId?.name || 'Course'}</h3>
                <p>Status: <span className="status">{challenge.status}</span></p>
                <p>Day {challenge.currentDay}/{challenge.totalDays}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${(challenge.currentDay / challenge.totalDays) * 100}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
