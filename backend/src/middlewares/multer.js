import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(_dirname, 'public', 'img');
        console.log("Multer ",uploadPath)
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        req.file = file;
        console.log("Multer ",req.file);
        cb(null, `${req.userId}-${uniqueSuffix}-${file.originalname}`);
    }
});

export const upload = multer({ storage: storage });