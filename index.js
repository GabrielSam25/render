const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl || !targetUrl.includes('pixeldrain.com')) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://pixeldrain.com/',
        'Origin': 'https://pixeldrain.com'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length']
    });

    response.data.pipe(res);
  } catch (error) {
    res.status(502).json({ error: 'Falha ao buscar o arquivo' });
  }
});

app.listen(process.env.PORT || 3000);