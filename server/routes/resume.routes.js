const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Student = require('../models/Student.model');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

router.use(protect);
router.use(authorize('student'));

// Generate resume
router.post('/generate', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const { template = 'professional' } = req.body;

    // Create PDF
    const doc = new PDFDocument();
    const filename = `resume-${student.enrollmentNumber}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../uploads/resumes', filename);

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Header
    doc.fontSize(24).text(student.fullName, { align: 'center' });
    doc.fontSize(10).text(`${student.user.email} | ${student.phone}`, { align: 'center' });
    if (student.linkedIn) doc.text(student.linkedIn, { align: 'center' });
    if (student.github) doc.text(student.github, { align: 'center' });
    doc.moveDown();

    // Education
    doc.fontSize(16).text('Education', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Branch: ${student.branch}`);
    doc.text(`CGPA: ${student.cgpa}`);
    doc.text(`Batch: ${student.batch}`);
    doc.moveDown();

    // Skills
    if (student.skills && student.skills.length > 0) {
      doc.fontSize(16).text('Skills', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      const skillsList = student.skills.map(s => s.name).join(', ');
      doc.text(skillsList);
      doc.moveDown();
    }

    // Projects
    if (student.projects && student.projects.length > 0) {
      doc.fontSize(16).text('Projects', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      student.projects.forEach(project => {
        doc.text(project.title, { bold: true });
        doc.text(project.description);
        if (project.technologies) {
          doc.text(`Technologies: ${project.technologies.join(', ')}`);
        }
        doc.moveDown(0.5);
      });
    }

    // Certifications
    if (student.certifications && student.certifications.length > 0) {
      doc.fontSize(16).text('Certifications', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      student.certifications.forEach(cert => {
        doc.text(`${cert.title} - ${cert.issuedBy}`);
      });
      doc.moveDown();
    }

    doc.end();

    stream.on('finish', () => {
      res.status(200).json({
        success: true,
        message: 'Resume generated successfully',
        resumeUrl: `/uploads/resumes/${filename}`
      });
    });

    stream.on('error', (error) => {
      logger.error('Resume generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating resume',
        error: error.message
      });
    });
  } catch (error) {
    logger.error('Generate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating resume',
      error: error.message
    });
  }
});

module.exports = router;
