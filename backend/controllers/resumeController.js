const Resume = require('../models/Resume');
const User = require('../models/User');
const { formatResponse } = require('../utils/helpers');
const AIService = require('../services/aiService');

class ResumeController {
  // Create/Update resume
  async createResume(req, res) {
    try {
      const { courseId, template, personalDetails, education, experience, skills, projects, certifications } = req.body;

      let resume = await Resume.findOne({ userId: req.userId, courseId });

      if (resume) {
        // Update existing
        resume.personalDetails = personalDetails || resume.personalDetails;
        resume.education = education || resume.education;
        resume.experience = experience || resume.experience;
        resume.skills = skills || resume.skills;
        resume.projects = projects || resume.projects;
        resume.certifications = certifications || resume.certifications;
        resume.template = template || resume.template;
      } else {
        // Create new
        resume = new Resume({
          userId: req.userId,
          courseId,
          personalDetails,
          education,
          experience,
          skills,
          projects,
          certifications,
          template: template || 'modern'
        });
      }

      resume.lastUpdatedAt = new Date();
      await resume.save();

      res.status(201).json(formatResponse('success', 'Resume created/updated successfully', { resume }));
    } catch (error) {
      console.error('Create resume error:', error);
      res.status(500).json(formatResponse('error', 'Failed to create resume'));
    }
  }

  // Get user resume
  async getUserResume(req, res) {
    try {
      const { courseId } = req.query;

      const filter = { userId: req.userId };
      if (courseId) filter.courseId = courseId;

      const resume = await Resume.findOne(filter);

      if (!resume) {
        return res.status(404).json(formatResponse('error', 'Resume not found'));
      }

      res.json(formatResponse('success', 'Resume retrieved', { resume }));
    } catch (error) {
      console.error('Get resume error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve resume'));
    }
  }

  // Analyze resume
  async analyzeResume(req, res) {
    try {
      const { resumeId } = req.params;
      const { courseType } = req.body;

      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json(formatResponse('error', 'Resume not found'));
      }

      // AI analysis
      const analysis = await AIService.analyzeResume(
        JSON.stringify(resume),
        courseType
      );

      // Update resume with analysis
      resume.atsScore = analysis.atsScore;
      resume.optimization = analysis.optimization;
      await resume.save();

      res.json(formatResponse('success', 'Resume analyzed', {
        analysis,
        resume
      }));
    } catch (error) {
      console.error('Analyze resume error:', error);
      res.status(500).json(formatResponse('error', 'Failed to analyze resume'));
    }
  }

  // Generate ATS-optimized resume
  async generateOptimizedResume(req, res) {
    try {
      const { resumeId, courseId } = req.params;

      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json(formatResponse('error', 'Resume not found'));
      }

      // AI generation
      const optimizedData = await AIService.generateResume(
        resume,
        courseId
      );

      res.json(formatResponse('success', 'Resume generated', {
        optimizedData,
        resume
      }));
    } catch (error) {
      console.error('Generate resume error:', error);
      res.status(500).json(formatResponse('error', 'Failed to generate resume'));
    }
  }

  // Export resume as PDF
  async exportResumePDF(req, res) {
    try {
      const { resumeId } = req.params;

      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json(formatResponse('error', 'Resume not found'));
      }

      // TODO: Generate PDF using pdfkit
      res.json(formatResponse('success', 'PDF exported', { pdfUrl: '/uploads/resume.pdf' }));
    } catch (error) {
      console.error('Export PDF error:', error);
      res.status(500).json(formatResponse('error', 'Failed to export PDF'));
    }
  }
}

module.exports = new ResumeController();
