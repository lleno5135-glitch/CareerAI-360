const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class CertificateService {
  async generateCertificate(certificateData) {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        layout: 'landscape'
      });

      const filePath = path.join(__dirname, `../uploads/cert-${certificateData.certificateNumber}.pdf`);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Background color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0');

      // Border
      doc.strokeColor('#0066cc').lineWidth(2);
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

      // Title
      doc.fillColor('#0066cc').fontSize(40).font('Helvetica-Bold').text('Certificate of Achievement', { align: 'center', y: 100 });

      // Course name
      doc.fillColor('#333').fontSize(24).font('Helvetica-Bold').text(certificateData.courseName, { align: 'center', y: 150 });

      // Text
      doc.fontSize(14).font('Helvetica').fillColor('#333');
      doc.text('This is to certify that', { align: 'center', y: 200 });

      // Student name
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#0066cc').text(certificateData.studentName, { align: 'center', y: 240 });

      // Achievement text
      doc.fontSize(12).font('Helvetica').fillColor('#333');
      doc.text('has successfully completed the 30-day challenge and demonstrated proficiency in the course.', { align: 'center', y: 290 });

      // Details
      doc.fontSize(11).fillColor('#666');
      doc.text(`Completion Date: ${new Date(certificateData.completionDate).toLocaleDateString()}`, { align: 'center', y: 350 });
      doc.text(`Score: ${certificateData.score}/100`, { align: 'center', y: 370 });
      doc.text(`Certificate ID: ${certificateData.certificateNumber}`, { align: 'center', y: 390 });

      // QR Code
      if (certificateData.qrCode) {
        const qrImagePath = path.join(__dirname, `../uploads/qr-${certificateData.certificateNumber}.png`);
        await QRCode.toFile(qrImagePath, certificateData.verificationUrl || 'https://careerai360.com/verify');
        doc.image(qrImagePath, doc.page.width / 2 - 40, 420, { width: 80 });
      }

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }

  async verifyCertificate(certificateNumber) {
    try {
      // TODO: Verify certificate in database
      return {
        isValid: true,
        certificateNumber,
        studentName: 'Student Name',
        courseName: 'Course Name',
        completionDate: new Date(),
        score: 85
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }

  generateCertificateNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CERT-${timestamp}-${random}`;
  }
}

module.exports = new CertificateService();
