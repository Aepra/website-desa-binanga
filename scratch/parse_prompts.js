const fs = require('fs');
const path = require('path');
const logPath = 'C:\\Users\\asusr\\.gemini\\antigravity-ide\\brain\\3a852b58-5743-476d-8d9c-f4a1b63b5aee\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

let count = 1;
lines.forEach((line, idx) => {
  if (!line.trim()) return;
  try {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT' || data.content?.includes('<USER_REQUEST>')) {
      let text = data.content;
      if (text.includes('<USER_REQUEST>')) {
        text = text.split('<USER_REQUEST>')[1].split('</USER_REQUEST>')[0];
      }
      if (!text.includes('{{ CHECKPOINT')) {
        console.log(`[Prompt ${count++}] ${text.trim()}`);
      }
    }
  } catch(e) {}
});
