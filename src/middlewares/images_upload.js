const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        // usa o nome do campo pra separar automaticamente
        const folder = file.fieldname; // "thumbnails" ou "advertisings"

        const localPath = path.resolve(__dirname, `../public/${folder}`);

        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath, { recursive: true });
        }

        cb(null, localPath);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const uniqueSuffix = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;

        const filename = `${uniqueSuffix}${ext}`;

        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }

    const error = new Error('Only image files are allowed!');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
};

module.exports = multer({
    storage,
    fileFilter
});