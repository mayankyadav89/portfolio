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
    res.status(200).json({ exists: false, error: 'No active resume found.' });
    return;
  }

  try {
    const stats = fs.statSync(filePath);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).json({
      exists: true,
      filename: 'Resume_Mayank_Yadav.pdf',
      size: stats.size,
      updatedAt: stats.mtime.toISOString(),
      downloadUrl: '/api/resume/download'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to inspect active resume.' });
  }
};
