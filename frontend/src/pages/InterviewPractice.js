import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interview.css';

const InterviewPractice = () => {
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const startInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/interviews/start',
        { courseId: 'default', interviewType: 'mock' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterview(response.data.data.interview);
      setCurrentQuestion(response.data.data.questions[0]);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/interviews/submit-answer',
        {
          interviewId: interview._id,
          questionId: currentQuestion._id,
          answerText: answer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback(response.data.data.analysis);
      setAnswer('');
      setCurrentQuestion(response.data.data.nextQuestion);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/interviews/${interview._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Interview completed!');
      setInterview(null);
    } catch (error) {
      console.error('Failed to complete interview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return (
      <div className="interview-container">
        <h1>Interview Practice</h1>
        <div className="interview-intro">
          <p>Prepare for real interviews with AI-powered mock interviews</p>
          <button onClick={startInterview} disabled={loading} className="btn-start">
            {loading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h2>Mock Interview</h2>
        <span className="question-counter">{interview.questions.length} questions</span>
      </div>

      {currentQuestion && (
        <div className="interview-content">
          <div className="question-section">
            <h3>Question {currentQuestion.questionNumber}</h3>
            <p className="question-text">{currentQuestion.question}</p>
            <span className="difficulty-badge">{currentQuestion.difficulty}</span>
          </div>

          <div className="answer-section">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="answer-input"
            />
            <button
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
              className="btn-submit"
            >
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>

          {feedback && (
            <div className="feedback-section">
              <h4>Feedback</h4>
              <p><strong>Score:</strong> {feedback.score}/100</p>
              <p><strong>Analysis:</strong> {feedback.feedback}</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={completeInterview}
        disabled={loading}
        className="btn-complete"
      >
        Complete Interview
      </button>
    </div>
  );
};

export default InterviewPractice;
