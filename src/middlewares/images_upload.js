const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const localPath = path.resolve(__dirname, '../public/thumbnails');
        
        // Cria o diretório se não existir
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath, { recursive: true });
        }

        cb(null, localPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}.jpg`;

        // Inicializa thumbnails como um array, se ainda não existir
        if (!req.body.thumbnails) req.body.thumbnails = [];
        
        // Adiciona apenas o caminho da imagem ao array thumbnails
        req.body.thumbnails.push(`/thumbnails/${uniqueSuffix}`);
        
        cb(null, uniqueSuffix); // Define o nome do arquivo
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        const error = new Error('Only image files are allowed!');
        error.code = 'INVALID_FILE_TYPE';
        cb(error, false);
    }
};

const images_upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = images_upload;
