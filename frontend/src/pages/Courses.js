import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [search, selectedCategory, courses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/courses/categories');
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (search) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/challenges/start',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll in course');
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div className="courses-page">
      <h1>Explore Courses</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          filteredCourses.map(course => (
            <div key={course._id} className="course-card">
              <img src={course.thumbnail || 'https://via.placeholder.com/300x200'} alt={course.name} />
              <h3>{course.name}</h3>
              <p className="course-category">{course.category}</p>
              <p className="course-description">{course.description.substring(0, 100)}...</p>
              <div className="course-meta">
                <span className="difficulty">{course.difficulty}</span>
                <span className="duration">30 days</span>
              </div>
              <button onClick={() => handleEnroll(course._id)} className="btn-enroll">
                Enroll Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
