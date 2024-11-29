import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage: any = diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cd) {
    cd(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
  },
});
