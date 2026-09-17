const fs = require('fs');
const path = require('path');

let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {}

let mammoth = null;
try {
  mammoth = require('mammoth');
} catch (e) {}

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.dicom'];
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  const modelExts = ['.glb', '.gltf', '.zip', '.html', '.htm', '.ppt', '.pptx', '.xls', '.xlsx'];

  if (imgExts.includes(ext)) {
    return `Anatomical diagram and clinical imaging cross-section file (${ext.toUpperCase()}). Key features: interactive pin hotspots, structural landmarks, and pathology mapping.`;
  } else if (videoExts.includes(ext)) {
    return `HD Video prosection lecture and clinical skill walkthrough recording (${ext.toUpperCase()}). Features step-by-step examination and movement assessment.`;
  } else if (modelExts.includes(ext)) {
    return `Interactive 3D WebGL anatomical model and simulation package (${ext.toUpperCase()}). 360° Rotatable joint view and clinical self-assessment portal.`;
  }

  const fileBuffer = fs.readFileSync(filePath);

  if (ext === '.pdf') {
    if (!pdfParse) pdfParse = require('pdf-parse');
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } else if (ext === '.docx' || ext === '.doc') {
    if (!mammoth) mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || '';
  } else if (ext === '.txt' || ext === '.md') {
    return fileBuffer.toString('utf-8');
  }
  return `Uploaded file resource (${ext.toUpperCase()}) for course study notes and interactive portal.`;
}

function formatTitleCase(str) {
  if (!str) return '';
  return str
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '')
    .join(' ');
}

function isJunkTitle(str) {
  if (!str) return true;
  const s = str.trim().toLowerCase();
  if (s.length < 3) return true;
  // Page number patterns: "page 1", "page: 1", "page - 1", "page 01", "page 1 of 12", "page 1/12"
  if (/^page\s*[-:#.]?\s*\d+/i.test(s)) return true;
  // "pg 1", "pg. 1", "p. 1", "p 1", "p-1"
  if (/^pg?\.?\s*[-:#.]?\s*\d+/i.test(s)) return true;
  // Pure digits or digits with page counts: "1", "1/10", "1 of 10"
  if (/^\d+(\s*(of|\/|-)\s*\d+)?$/i.test(s)) return true;
  // Slide or sheet numbers: "slide 1", "sheet 1"
  if (/^(slide|sheet)\s*[-:#.]?\s*\d+/i.test(s)) return true;
  // Generic placeholders
  if (/^(untitled|document|file|notes|study notes|pdf|scan|download|sample|reading material|handout)$/i.test(s)) return true;
  if (/^(table of contents|contents|index|preface|introduction|syllabus|curriculum)$/i.test(s)) return true;
  if (/^all rights reserved|^copyright|^confidential/i.test(s)) return true;
  if (/^https?:\/\//i.test(s)) return true;
  return false;
}

function parseCourseFromText(text, originalFilename = '') {
  let cleanFilename = originalFilename
    ? originalFilename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
  if (cleanFilename) {
    cleanFilename = formatTitleCase(cleanFilename);
  }

  const defaultTitle = cleanFilename || 'Uploaded Study Notes';

  if (!text || !text.trim()) {
    return {
      title: defaultTitle,
      subtitle: `Comprehensive study guide and curriculum reading notes for ${defaultTitle}.`,
      description: `Course content automatically extracted from ${originalFilename || 'uploaded document'}.`,
      keyHighlights: '• Core Concepts & Clinical Principles\n• Key Definitions & Terminology\n• Examination & Treatment Protocols',
      modules: [{ title: 'Module 1: Complete Study Notes', lessons: [{ title: 'Chapter 1: Reading Material' }] }]
    };
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  // Title extraction: Scan top 25 lines for a prominent non-empty header line that is NOT "Page 1" or junk
  let candidateTitle = '';
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i];
    if (isJunkTitle(line)) continue;

    const letters = (line.match(/[a-zA-Z]/g) || []).length;
    if (letters >= 4 && line.length >= 4 && line.length <= 110) {
      let cleaned = line
        .replace(/^(title|subject|topic|unit\s*\d+|chapter\s*\d+|module\s*\d+)\s*[:\-]\s*/i, '')
        .replace(/^syllabus\s*[:\-]?|^course outline\s*[:\-]?|^notes on\s*[:\-]?|^study guide for\s*[:\-]?/i, '')
        .trim();

      if (!isJunkTitle(cleaned) && cleaned.length >= 4) {
        candidateTitle = cleaned;
        break;
      }
    }
  }

  // Preference: Use candidate title if found and valid; otherwise use clean formatted filename
  let title = candidateTitle || defaultTitle;
  if (isJunkTitle(title)) {
    title = defaultTitle;
  }
  if (title.length > 100) title = title.substring(0, 100) + '...';

  // Subtitle extraction: Next line with meaningful text that is not junk
  let subtitle = '';
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i];
    if (line !== title && !isJunkTitle(line) && line.length > 15 && line.length < 180) {
      subtitle = line;
      break;
    }
  }
  if (!subtitle) {
    subtitle = `Comprehensive study guide and curriculum lecture notes for ${title}.`;
  }
  if (subtitle.length > 180) subtitle = subtitle.substring(0, 180) + '...';

  // Description extraction: Next 2-5 paragraphs, filtering out junk lines
  const descParagraphs = lines.slice(0, 15).filter(l => l !== title && l !== subtitle && !isJunkTitle(l) && l.length > 25);
  let description = descParagraphs.slice(0, 5).join('\n\n') || text.substring(0, 500);
  if (description.length > 900) description = description.substring(0, 900) + '...';

  // Key Highlights extraction: Find key sentences, bullet points, or core definitions
  const highlightCandidates = lines.filter(l => 
    !isJunkTitle(l) && (
      l.startsWith('•') || l.startsWith('-') || l.startsWith('*') ||
      /^(key|definition|clinical|note|important|summary|feature|hazard|protocol|principle)/i.test(l) ||
      (l.length > 20 && l.length < 120 && l.endsWith('.'))
    )
  );

  let keyHighlights = '';
  if (highlightCandidates.length > 0) {
    const formatted = highlightCandidates.slice(0, 8).map(h => h.startsWith('•') ? h : `• ${h.replace(/^[-*]\s*/, '')}`);
    keyHighlights = formatted.join('\n');
  } else {
    const fallbackLines = lines.filter(l => !isJunkTitle(l) && l !== title && l.length > 15 && l.length < 120).slice(0, 6);
    keyHighlights = fallbackLines.map(l => `• ${l}`).join('\n') || `• Core syllabus concepts and clinical topics included in ${title}.\n• Detailed definitions, diagrams, and examination procedures.\n• Complete exam-oriented notes and revision guide.`;
  }

  // Modules & Lessons parsing
  const modules = [];
  let currentModule = null;

  const moduleRegex = /^(module|chapter|unit|section|part|block|paper)\s*(\d+|[ivxlcdm]+)[:\.\s-]*(.*)/i;
  const lessonRegex = /^(lesson|topic|lecture|sub-unit|chapter|unit|section|\d+[\.\)])\s*(\d+|[ivxlcdm]+)?[:\.\s-]*(.*)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (moduleRegex.test(line) || (line.length < 80 && /^[A-Z0-9\s]{4,80}$/.test(line) && i > 3)) {
      if (currentModule && currentModule.lessons.length > 0) {
        modules.push(currentModule);
      }
      const match = line.match(moduleRegex);
      const modTitle = match ? `${match[1]} ${match[2]}: ${match[3] || 'Overview'}`.trim() : line;
      currentModule = { title: modTitle, lessons: [] };
      continue;
    }

    if (currentModule && (lessonRegex.test(line) || (line.length < 90 && line.length > 5 && !line.endsWith('.')))) {
      if (currentModule.lessons.length < 15) {
        currentModule.lessons.push({ title: line });
      }
    }
  }

  if (currentModule && currentModule.lessons.length > 0) {
    modules.push(currentModule);
  }

  if (modules.length === 0) {
    const chunkSize = Math.max(3, Math.floor(lines.length / 3));
    const module1Lessons = lines.slice(0, chunkSize).filter(l => l.length < 80).slice(0, 5);
    const module2Lessons = lines.slice(chunkSize).filter(l => l.length < 80).slice(0, 5);

    modules.push({
      title: 'Module 1: Complete Study Notes & Reading Material',
      lessons: module1Lessons.length > 0 ? module1Lessons.map(t => ({ title: t })) : [{ title: 'Chapter 1: Key Concepts & Syllabus Overview' }]
    });

    if (module2Lessons.length > 0) {
      modules.push({
        title: 'Module 2: Advanced Topics & Handouts',
        lessons: module2Lessons.map(t => ({ title: t }))
      });
    }
  }

  return { title, subtitle, description, keyHighlights, modules, fullText: text };
}

async function parseDocument(filePath, originalFilename = '') {
  try {
    const text = await extractTextFromFile(filePath);
    return parseCourseFromText(text, originalFilename);
  } catch (err) {
    console.warn('Document Text Extraction Warning:', err.message);
    return parseCourseFromText('', originalFilename);
  }
}

module.exports = {
  extractTextFromFile,
  parseCourseFromText,
  parseDocument
};
