
const fs = require('fs');

function removeUploadedFiles(files) {
  if (!files || !files.length) return;

  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Erro ao remover o arquivo ${file.path}:`, err);
    });
  });
}

module.exports = removeUploadedFiles;