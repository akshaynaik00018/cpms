const PDFDocument = require('pdfkit');
const fs = require('fs');

// Generate placement report
const generatePlacementReport = async (data, filepath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filepath);
      
      doc.pipe(stream);
      
      // Header
      doc.fontSize(20).text('Placement Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Academic Year: ${data.academicYear}`, { align: 'center' });
      doc.moveDown(2);
      
      // Summary Statistics
      doc.fontSize(16).text('Placement Statistics', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Total Students: ${data.totalStudents}`);
      doc.text(`Placed Students: ${data.placedStudents}`);
      doc.text(`Placement Percentage: ${data.placementPercentage}%`);
      doc.text(`Average Package: ₹${data.averagePackage} LPA`);
      doc.text(`Highest Package: ₹${data.highestPackage} LPA`);
      doc.text(`Lowest Package: ₹${data.lowestPackage} LPA`);
      doc.moveDown(2);
      
      // Branch-wise Statistics
      if (data.branchWiseStats) {
        doc.fontSize(16).text('Branch-wise Statistics', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        
        data.branchWiseStats.forEach(branch => {
          doc.text(`${branch.name}: ${branch.placed}/${branch.total} (${branch.percentage}%)`);
        });
        doc.moveDown(2);
      }
      
      // Top Recruiters
      if (data.topRecruiters) {
        doc.fontSize(16).text('Top Recruiters', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        
        data.topRecruiters.forEach((company, index) => {
          doc.text(`${index + 1}. ${company.name} - ${company.hires} students`);
        });
      }
      
      // Footer
      doc.moveDown(3);
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(filepath);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generatePlacementReport
};
