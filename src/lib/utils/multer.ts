import multer from 'multer';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const upload = (fileType: 'pdf' | 'txt') =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (fileType === 'pdf' && file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed!'));
      } else if (fileType === 'txt' && file.mimetype !== 'text/plain') {
        return cb(new Error('Only TXT files are allowed!'));
      }
      cb(null, true);
    }
  });
