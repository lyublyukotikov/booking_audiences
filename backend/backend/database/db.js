//файл подключения к базе данных тут мы создаем пул и плдключаемся к базе данных postgresql 
import pkg from 'pg';
const { Pool } = pkg;

// Создаем пул соединений к базе данных
const pool = new Pool({
  user: "postgres",
  password: "12345678",
  host: "localhost",
  port: 5432,
  database: 'booking_soft'
});

// Событие "connect" 
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export default pool;





