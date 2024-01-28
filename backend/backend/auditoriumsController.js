
import db from "../backend/database/db.js";
//Контроллер для работы с аудиториями 
class AuditoriumsController {
  // получаем аудитории 
  async getAuditoriums(req, res) {
    try {
      const { date_available, building, city } = req.query;
  
      const conditions = [];
      const values = [];
  
      if (date_available) {
        conditions.push('date_available = $1');
        values.push(date_available);
      }
      if (building) {
        conditions.push('building = $2');
        values.push(building);
      }
      if (city) {
        conditions.push('city = $3');
        values.push(city);
      }
  
      let query = 'SELECT id, name, building, city, date_available, image_path FROM auditoriums'; // Включите столбец image_path
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
  
      // Если нет условий, просто выбрать все аудитории
      if (conditions.length === 0) {
        query = 'SELECT id, name, building, city, date_available, image_path, is_active FROM auditoriums';
      }
  
      // Выполняем запрос с переданными параметрами
      const auditoriums = await db.query(query, values);
      res.json(auditoriums.rows);
    } catch (e) {
      console.error('Ошибка при получении данных об аудиториях:', e);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
// Добавляем аудитории
  async postAuditorium(req, res) {
    try {
      const { image_path, name, building, city, date_available } = req.body;

      const query = `
        INSERT INTO auditoriums (image_path, name, building, city, date_available)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [image_path, name, building, city, date_available];
      const newAuditorium = await db.query(query, values);

      res.json({ message: 'Аудитория успешно добавлена', auditorium: newAuditorium.rows[0] });
    } catch (e) {
      console.error('Ошибка при добавлении аудитории:', e);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
 // Устанавливаем is_active в false для аудитории по ID
 async deactivateAuditorium(req, res) {
  const { auditorium_id } = req.params;


  try {
    const result = await db.query(
      'UPDATE auditoriums SET is_active = $1 WHERE id = $2 RETURNING *',
      [false, auditorium_id]
    );
    

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Аудитория не найдена' });
    }

    res.json({ message: 'Статус аудитории успешно изменен на неактивный', deactivatedAuditorium: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при изменении статуса аудитории:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}
}


export default new AuditoriumsController();