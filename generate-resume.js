const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const htmlPath = path.resolve(__dirname, 'public', 'resume.html');
  const pdfPath = path.resolve(__dirname, 'public', 'Prashik_Fulke_Resume.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('resume.html not found in public/');
    process.exit(1);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  console.log('Loading:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to load (with a timeout fallback)
  await new Promise(r => setTimeout(r, 1500));

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  });

  await browser.close();
  console.log('PDF generated at:', pdfPath);
})();
