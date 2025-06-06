import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // ✅ 引入 cors

const app = express();
app.use(cors()); //允许跨域请求
app.get('/api/download-pdf', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).send('Failed to fetch the file from remote server');
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const dispositionFilename = decodeURIComponent(
      url.split('/').pop().split('?')[0] || 'file.pdf'
    );
const encodedFilename = encodeURIComponent(dispositionFilename);

res.setHeader('Content-Type', contentType);
res.setHeader(
  'Content-Disposition',
  `attachment; filename*=UTF-8''${encodedFilename}`
);
    response.body.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Download failed');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`PDF download proxy running on http://localhost:${PORT}`);
});
