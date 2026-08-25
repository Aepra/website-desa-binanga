const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'modul_panduan.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace **text** with <strong>text</strong>
const updatedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully replaced all **markdown bold** syntax with <strong>HTML tags</strong>!');
