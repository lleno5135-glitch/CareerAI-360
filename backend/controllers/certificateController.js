const Certificate = require('../models/Certificate');
const Challenge = require('../models/Challenge');
const { formatResponse } = require('../utils/helpers');
const CertificateService = require('../services/certificateService');

class CertificateController {
  // Generate certificate
  async generateCertificate(req, res) {
    try {
      const { challengeId } = req.params;

      const challenge = await Challenge.findById(challengeId)
        .populate('userId')
        .populate('courseId');

      if (!challenge) {
        return res.status(404).json(formatResponse('error', 'Challenge not found'));
      }

      // Check if challenge is completed
      if (challenge.status !== 'completed') {
        return res.status(400).json(formatResponse('error', 'Challenge must be completed first'));
      }

      // Check if certificate already exists
      const existingCert = await Certificate.findOne({ challengeId });
      if (existingCert) {
        return res.status(400).json(formatResponse('error', 'Certificate already generated'));
      }

      // Generate certificate number
      const certificateNumber = CertificateService.generateCertificateNumber();
      const verificationUrl = `https://careerai360.com/certificate/${certificateNumber}`;

      // Create certificate record
      const certificate = new Certificate({
        userId: challenge.userId._id,
        challengeId,
        courseId: challenge.courseId._id,
        certificateNumber,
        courseName: challenge.courseId.name,
        studentName: challenge.userId.fullName,
        studentEmail: challenge.userId.email,
        completionDate: challenge.completedDate,
        score: challenge.averageScore,
        averageScore: challenge.averageScore,
        certificateLevel: challenge.averageScore >= 85 ? 'excellence' : challenge.averageScore >= 70 ? 'completion' : 'completion',
        skillsAchieved: challenge.skillsGained,
        verificationUrl
      });

      // Generate PDF
      const pdfPath = await CertificateService.generateCertificate({
        ...certificate.toObject(),
        certificateNumber,
        verificationUrl
      });

      certificate.pdfUrl = pdfPath;
      await certificate.save();

      // Update challenge
      challenge.certificateGenerated = true;
      challenge.certificateId = certificate._id;
      await challenge.save();

      res.status(201).json(formatResponse('success', 'Certificate generated', { certificate }));
    } catch (error) {
      console.error('Generate certificate error:', error);
      res.status(500).json(formatResponse('error', 'Failed to generate certificate'));
    }
  }

  // Verify certificate
  async verifyCertificate(req, res) {
    try {
      const { certificateNumber } = req.params;

      const certificate = await Certificate.findOne({ certificateNumber })
        .populate('userId', 'firstName lastName email')
        .populate('courseId', 'name');

      if (!certificate) {
        return res.status(404).json(formatResponse('error', 'Certificate not found'));
      }

      // Increment verification count
      certificate.verifications = (certificate.verifications || 0) + 1;
      await certificate.save();

      res.json(formatResponse('success', 'Certificate verified', { certificate }));
    } catch (error) {
      console.error('Verify certificate error:', error);
      res.status(500).json(formatResponse('error', 'Failed to verify certificate'));
    }
  }

  // Get user certificates
  async getUserCertificates(req, res) {
    try {
      const certificates = await Certificate.find({ userId: req.userId })
        .populate('courseId')
        .sort({ issuanceDate: -1 });

      res.json(formatResponse('success', 'Certificates retrieved', { certificates }));
    } catch (error) {
      console.error('Get certificates error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve certificates'));
    }
  }

  // Download certificate
  async downloadCertificate(req, res) {
    try {
      const { certificateId } = req.params;

      const certificate = await Certificate.findById(certificateId);
      if (!certificate) {
        return res.status(404).json(formatResponse('error', 'Certificate not found'));
      }

      if (certificate.userId.toString() !== req.userId.toString()) {
        return res.status(403).json(formatResponse('error', 'Unauthorized'));
      }

      res.download(certificate.pdfUrl);
    } catch (error) {
      console.error('Download certificate error:', error);
      res.status(500).json(formatResponse('error', 'Failed to download certificate'));
    }
  }
}

module.exports = new CertificateController();
