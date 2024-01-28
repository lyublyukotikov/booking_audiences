import multer from 'multer';
import db from '../backend/database/db.js';
import fs from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Укажите директорию для сохранения загруженных изображений
    cb(null, 'D:\\booking_audiences\\backend\\imageUser');
  },
  filename: function (req, file, cb) {
    // Генерируйте уникальное имя файла, чтобы избежать конфликтов
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

class PhotoProfilController {
  async uploadImage(req, res) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Ошибка при загрузке изображения:', err);
        return res.status(500).json({ error: 'Ошибка при загрузке изображения' });
      }

      const imageFilePath = req.file.path;

      // Получите userId из запроса или из вашей аутентификации
      const userId = req.user_id; // Предположим, что вы используете аутентификацию и userId доступен в req.user
// Преобразовать изображение в бинарные данные
const imageBuffer = fs.readFileSync(imageFilePath); // Используйте 'fs' модуль для чтения файла
      // Обновите запись пользователя в базе данных, сохраняя только путь к изображению
      db.query(
        'UPDATE users SET photo_path = $1 WHERE id = $2',
        [imageBuffer, userId],
        (error, results) => {
          if (error) {
            console.error('Ошибка при обновлении изображения пользователя:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
          } else {
            console.log(`Изображение успешно обновлено для пользователя с ID: ${userId}`);
            res.status(200).json({ message: 'Изображение успешно обновлено' });
          }
        }
      );
    });
  }
}

export default new PhotoProfilController();