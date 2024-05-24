import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './public/img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      req.file = file;
      return cb(null, req.userId+'-'+uniqueSuffix+'-'+file.originalname)
    }
  })

export const upload = multer({ storage: storage })