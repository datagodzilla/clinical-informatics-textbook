const http = require('http');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const PORT = 8888;
const BASE_DIR = '/Users/Wolverine/00_PROJECTS/ACTION-PLAN/CLINICAL-INFORMATICS-TEXTBOOK';
const DOCS_DIR = path.join(BASE_DIR, 'docs');
const DEFAULT_MD_FILE = path.join(DOCS_DIR, 'CLINICAL-INFORMATICS-TEXTBOOK-KDP.md');

// Configure marked for GitHub-style rendering
marked.use({
  gfm: true,
  breaks: false
});

// Custom extension to generate proper heading IDs
marked.use({
  renderer: {
    heading(token) {
      const text = token.text || '';
      const depth = token.depth || 1;

      // Generate GitHub-style anchor ID
      const id = text
        .toLowerCase()
        .replace(/<[^>]*>/g, '')     // Remove HTML tags
        .replace(/[^\w\s-]/g, '')    // Remove special chars except hyphens
        .replace(/\s+/g, '-')        // Spaces to hyphens
        .replace(/-+/g, '-')         // Multiple hyphens to single
        .replace(/^-|-$/g, '');      // Trim hyphens

      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
  }
});

// Generate HTML wrapper for markdown content
function generateHtml(htmlContent, title = 'Clinical Informatics Textbook') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="author" content="Narayana Surampudi, PhD">
  <meta name="description" content="Clinical Informatics: A Provider's Journey Through Healthcare Data - A comprehensive guide with case studies, workflows, and technology solutions.">
  <style>
    :root {
      --text-color: #24292f;
      --bg-color: #ffffff;
      --border-color: #d0d7de;
      --link-color: #0969da;
      --code-bg: #f6f8fa;
      --blockquote-border: #d0d7de;
      --table-border: #d0d7de;
      --table-header-bg: #f6f8fa;
      --accent-color: #1a365d;
      --accent-light: #2c5282;
    }
    html { scroll-behavior: smooth; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      font-size: 16px; line-height: 1.6; color: var(--text-color);
      background-color: var(--bg-color); margin: 0; padding: 0;
    }
    .container { max-width: 980px; margin: 0 auto; padding: 45px; padding-top: 20px; }
    @media (max-width: 767px) { .container { padding: 15px; } }

    /* Typography */
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
    h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 2px solid var(--accent-color); color: var(--accent-color); }
    h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid var(--border-color); color: var(--accent-light); }
    h3 { font-size: 1.25em; color: var(--accent-light); }
    h4 { font-size: 1em; }
    p { margin-top: 0; margin-bottom: 16px; }

    /* Links */
    a { color: var(--link-color); text-decoration: none; transition: color 0.2s; }
    a:hover { text-decoration: underline; color: var(--accent-light); }

    /* Lists */
    ul, ol { margin-top: 0; margin-bottom: 16px; padding-left: 2em; }
    li { margin-top: 0.25em; }

    /* Code */
    code {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
      font-size: 85%; background-color: var(--code-bg); padding: 0.2em 0.4em; border-radius: 6px;
    }
    pre {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
      font-size: 85%; background-color: var(--code-bg); padding: 16px;
      overflow: auto; border-radius: 6px; line-height: 1.45; margin-bottom: 16px;
      border-left: 4px solid var(--accent-color);
    }
    pre code { background-color: transparent; padding: 0; font-size: 100%; }

    /* Tables */
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { border: 1px solid var(--table-border); padding: 10px 13px; }
    th { background-color: var(--accent-color); color: white; font-weight: 600; }
    tr:nth-child(2n) { background-color: #f6f8fa; }
    tr:hover { background-color: #e8f4fd; }

    /* Blockquotes */
    blockquote {
      margin: 0 0 16px 0; padding: 1em 1.5em; color: #57606a;
      border-left: 4px solid var(--accent-color); background-color: #f8f9fa;
      border-radius: 0 6px 6px 0; font-style: italic;
    }

    /* Horizontal rules */
    hr { height: 2px; padding: 0; margin: 32px 0; background: linear-gradient(to right, var(--accent-color), var(--border-color)); border: 0; }

    /* Images - Cover page styling */
    img { max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

    /* Cover page specific styling */
    #cover-page, a[id="cover-page"] { scroll-margin-top: 80px; }
    #cover-page + div, a[id="cover-page"] + div {
      background: linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #3182ce 100%);
      padding: 40px; border-radius: 12px; margin-bottom: 40px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    #cover-page + div img, a[id="cover-page"] + div img {
      max-width: 400px; margin: 0 auto 20px; border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    #cover-page + div h3, a[id="cover-page"] + div h3 { color: #e2e8f0 !important; border: none; }
    #cover-page + div strong, a[id="cover-page"] + div strong { color: #ffffff; }
    #cover-page + div em, a[id="cover-page"] + div em { color: #cbd5e0; }

    /* Target highlight */
    :target { background-color: #fff8c5; padding: 8px; margin: -8px; border-radius: 6px; scroll-margin-top: 80px; }

    /* Center aligned content */
    div[align="center"] { text-align: center; }

    /* Navigation bar */
    .nav-bar {
      background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
      padding: 12px 20px; border-bottom: none;
      position: sticky; top: 0; z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .nav-bar a {
      margin-right: 20px; font-size: 14px; color: white; font-weight: 500;
      padding: 6px 12px; border-radius: 4px; transition: background 0.2s;
    }
    .nav-bar a:hover { background: rgba(255,255,255,0.2); text-decoration: none; }
    .nav-bar .brand {
      font-weight: 700; font-size: 16px; margin-right: 30px;
    }

    /* Scroll to top button */
    .back-to-top {
      position: fixed; bottom: 30px; right: 30px;
      background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
      color: white; width: 50px; height: 50px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      text-decoration: none; opacity: 0; visibility: hidden;
      transition: all 0.3s ease; cursor: pointer; border: none;
    }
    .back-to-top.visible { opacity: 1; visibility: visible; }
    .back-to-top:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
      text-decoration: none;
    }

    /* Progress bar */
    .progress-bar {
      position: fixed; top: 0; left: 0; width: 0%; height: 3px;
      background: linear-gradient(90deg, #3182ce, #63b3ed);
      z-index: 1000; transition: width 0.1s;
    }

    /* Chapter markers */
    h2[id^="chapter"] {
      background: linear-gradient(90deg, var(--accent-color), transparent);
      padding: 12px 16px; margin-left: -16px; margin-right: -16px;
      color: white !important; border-radius: 6px 6px 0 0;
    }

    /* Callout boxes */
    div[style*="background-color"] {
      border-radius: 8px; margin: 16px 0; padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* TOC styling */
    #table-of-contents { color: var(--accent-color); }
    #table-of-contents + ul, #table-of-contents + ul ul {
      list-style-type: none; padding-left: 1.5em;
    }
    #table-of-contents + ul > li { margin-bottom: 8px; }
    #table-of-contents + ul a {
      display: inline-block; padding: 4px 8px; border-radius: 4px;
      transition: background 0.2s;
    }
    #table-of-contents + ul a:hover { background: #e8f4fd; }

    /* Print styles */
    @media print {
      .nav-bar, .back-to-top, .progress-bar { display: none !important; }
      .container { padding: 0; max-width: 100%; }
      h1, h2, h3 { page-break-after: avoid; }
      pre, table, img { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="progress-bar" id="progressBar"></div>
  <div class="nav-bar">
    <a href="/" class="brand">📚 Clinical Informatics</a>
    <a href="/">KDP Version</a>
    <a href="/docs/CLINICAL-INFORMATICS-TEXTBOOK-ACADEMIC.md">Academic</a>
    <a href="/docs/CLINICAL-INFORMATICS-TEXTBOOK.md">Original</a>
    <a href="/docs/KDP-PUBLISHING-GUIDE.md">Publishing Guide</a>
  </div>
  <div class="container">
    ${htmlContent}
  </div>
  <button class="back-to-top" id="backToTop" onclick="scrollToTop()" title="Scroll to top">↑</button>

  <script>
    // Scroll to top functionality
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Show/hide scroll button and update progress bar
    window.addEventListener('scroll', function() {
      const backToTop = document.getElementById('backToTop');
      const progressBar = document.getElementById('progressBar');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      // Update progress bar
      progressBar.style.width = scrollPercent + '%';

      // Show/hide back to top button
      if (scrollTop > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Add copy button to code blocks
    document.querySelectorAll('pre').forEach(block => {
      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 8px;font-size:12px;background:#1a365d;color:white;border:none;border-radius:4px;cursor:pointer;opacity:0;transition:opacity 0.2s;';
      block.style.position = 'relative';
      block.appendChild(button);

      block.addEventListener('mouseenter', () => button.style.opacity = '1');
      block.addEventListener('mouseleave', () => button.style.opacity = '0');

      button.addEventListener('click', () => {
        const code = block.querySelector('code') || block;
        navigator.clipboard.writeText(code.textContent.replace('Copy', ''));
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
      });
    });
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Serve assets (images, SVGs)
  if (url.pathname.startsWith('/assets/')) {
    const assetPath = path.join(BASE_DIR, url.pathname);
    if (fs.existsSync(assetPath)) {
      const ext = path.extname(assetPath).toLowerCase();
      const mimeTypes = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(assetPath).pipe(res);
      return;
    }
  }

  // Serve markdown files from /docs/ route
  if (url.pathname.startsWith('/docs/') && url.pathname.endsWith('.md')) {
    const mdFileName = url.pathname.replace('/docs/', '');
    const mdFilePath = path.join(DOCS_DIR, mdFileName);

    if (fs.existsSync(mdFilePath)) {
      try {
        let mdContent = fs.readFileSync(mdFilePath, 'utf8');
        mdContent = mdContent.replace(/!\[([^\]]*)\]\(\.\.\/assets\//g, '![$1](/assets/');
        mdContent = mdContent.replace(/src="\.\.\/assets\//g, 'src="/assets/');
        const htmlContent = marked.parse(mdContent);

        const fullHtml = generateHtml(htmlContent, mdFileName);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      } catch (err) {
        console.error('Error:', err);
        res.writeHead(500);
        res.end('Error: ' + err.message);
        return;
      }
    } else {
      res.writeHead(404);
      res.end('File not found: ' + mdFileName);
      return;
    }
  }

  // Serve markdown as HTML (homepage - default file)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      let mdContent = fs.readFileSync(DEFAULT_MD_FILE, 'utf8');
      mdContent = mdContent.replace(/!\[([^\]]*)\]\(\.\.\/assets\//g, '![$1](/assets/');
      mdContent = mdContent.replace(/src="\.\.\/assets\//g, 'src="/assets/');
      const htmlContent = marked.parse(mdContent);
      const fullHtml = generateHtml(htmlContent, 'Clinical Informatics Textbook - KDP Version');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
    } catch (err) {
      console.error('Error:', err);
      res.writeHead(500);
      res.end('Error: ' + err.message);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n📚 Clinical Informatics Textbook Server`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Available pages:`);
  console.log(`     - / (KDP Version)`);
  console.log(`     - /docs/CLINICAL-INFORMATICS-TEXTBOOK-ACADEMIC.md`);
  console.log(`     - /docs/CLINICAL-INFORMATICS-TEXTBOOK.md (Original)`);
  console.log(`     - /docs/KDP-PUBLISHING-GUIDE.md`);
  console.log(`   Source: ${DEFAULT_MD_FILE}\n`);
});
