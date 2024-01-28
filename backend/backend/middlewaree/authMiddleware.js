import jwt from 'jsonwebtoken';
import secretKey from '../config/config.js';
import db from "../database/db.js";
export default async function (req, res, next) {
  // Работа с токеном в заголовке запроса 
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }

    const decodedData = jwt.verify(token, secretKey);
    req.user = decodedData;
    console.log(req.user);

    
const userData = await db.query('SELECT id, login, university, photo_path FROM users WHERE id = $1', [req.user.id]);

    if (!userData) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Отправьте только данные пользователя в ответе
    return res.status(200).json(userData);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: 'Пользователь не авторизован' });
  }
}