const multer = require("multer");
const { diskStorage } = require("multer");

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split(".")[1]

        const newFileName = require('crypto')
            .randomBytes(64)
            .toString('hex');

        cb(null, `${newFileName}.${fileExtension}`);
    }
})

const upload = multer({ storage })

module.exports = {
    upload
}
// export the upload middleware
