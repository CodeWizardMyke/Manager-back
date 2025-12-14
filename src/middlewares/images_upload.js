const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const localPath = path.resolve(__dirname, '../public/thumbnails');

        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath, { recursive: true });
        }

        cb(null, localPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.random()}.jpg`;

        if (!req.body.images) req.body.images = [];
        req.body.images.push(`/thumbnails/${uniqueSuffix}`);

        cb(null, uniqueSuffix);
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

module.exports = multer({
    storage,
    fileFilter
});
