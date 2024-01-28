import db from '../backend/database/db.js'; // Подключаем пул подключения к базе данных
// Контроллер для создания заявки на бронь аудитории
class RequestsController {
  async createRequest(req, res) {
    try {
      const {
        organization_name,
        event_description,
        responsible_name,
        responsible_phone,
        responsible_email,
        students_yfu,
        students_non_yfu,
        auditorium_id,
        user_id,
      } = req.body;

      const result = await db.query(
        'INSERT INTO requests (organization_name, event_description, responsible_name, responsible_phone, responsible_email, students_yfu, students_non_yfu, auditorium_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [organization_name, event_description, responsible_name, responsible_phone, responsible_email, students_yfu, students_non_yfu, auditorium_id, user_id]
      );

      const newRequestId = result.rows[0].id;
      res.json({ id: newRequestId });
    } catch (err) {
      console.error('Ошибка при выполнении SQL-запроса:', err);
      res.status(500).send('Ошибка сервера');
    }
  }
}

export default new RequestsController();