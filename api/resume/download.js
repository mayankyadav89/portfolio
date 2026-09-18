const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const candidatePaths = [
    path.join(process.cwd(), 'resume.pdf'),
    path.join(process.cwd(), 'Resume mayank yadav.pdf'),
    path.join(process.cwd(), 'Resume_mayank_yadav.pdf'),
    path.join(process.cwd(), 'storage', 'resume', 'current.pdf')
  ];

  let filePath = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    res.status(404).json({ error: 'Resume PDF document not found on server.' });
    return;
  }

  try {
    const fileStat = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', fileStat.size);
    res.setHeader('Content-Disposition', 'inline; filename="Resume_Mayank_Yadav.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

    res.status(200).send(fileBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error delivering resume file.' });
  }
};
