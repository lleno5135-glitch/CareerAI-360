import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenge.css';

const ChallengePage = ({ challengeId }) => {
  const [challenge, setChallenge] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [submission, setSubmission] = useState({ content: '', submissionType: 'text' });
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/challenges/${challengeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChallenge(response.data.data.challenge);

      const tasksResponse = await axios.get(
        `/api/tasks/${challengeId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasksResponse.data.data);
      if (tasksResponse.data.data.length > 0) {
        setCurrentTask(tasksResponse.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!submission.content.trim()) {
      alert('Please provide a submission');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/submissions/submit',
        {
          dailyTaskId: currentTask._id,
          challengeId: challenge._id,
          submissionType: submission.submissionType,
          content: submission.content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const evalResponse = await axios.post(
        `/api/submissions/${response.data.data.submission._id}/evaluate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(evalResponse.data.data.evaluation);
      setSubmission({ content: '', submissionType: 'text' });
    } catch (error) {
      console.error('Failed to submit task:', error);
      alert('Failed to submit task');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading challenge...</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="challenge-page">
      <div className="challenge-header">
        <h1>{challenge.courseId?.name || 'Challenge'}</h1>
        <div className="challenge-meta">
          <span>Day {challenge.currentDay}/{challenge.totalDays}</span>
          <span>Status: {challenge.status}</span>
        </div>
      </div>

      {currentTask && (
        <div className="task-section">
          <div className="task-content">
            <h2>{currentTask.title || 'Daily Task'}</h2>
            <div className="task-description">
              {currentTask.description || 'Complete the task below'}
            </div>
          </div>

          <div className="submission-section">
            <h3>Your Submission</h3>
            <select
              value={submission.submissionType}
              onChange={(e) => setSubmission({ ...submission, submissionType: e.target.value })}
              className="type-select"
            >
              <option value="text">Text</option>
              <option value="code">Code</option>
              <option value="link">Link</option>
            </select>

            <textarea
              value={submission.content}
              onChange={(e) => setSubmission({ ...submission, content: e.target.value })}
              placeholder="Enter your submission..."
              rows={8}
              className="submission-input"
            />

            <button
              onClick={handleSubmitTask}
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Submitting...' : 'Submit Task'}
            </button>
          </div>

          {result && (
            <div className="result-section">
              <h3>Evaluation Result</h3>
              <div className="result-card">
                <p><strong>Score:</strong> {result.score}/100</p>
                <p><strong>Feedback:</strong> {result.feedback}</p>
                {result.codeAnalysis && (
                  <div className="analysis">
                    <h4>Code Analysis:</h4>
                    <p>{result.codeAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
