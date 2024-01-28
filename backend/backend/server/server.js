import express from 'express';
import cookieParser from 'cookie-parser';  // Импортируем cookieParser
import cors from 'cors'
import router from '../authRouter.js';
//Разварачиваем сервер на Express
const PORT = 8000;
const app = express();
app.use(cookieParser());  // Используем cookieParser
app.use(express.json());
app.use(cors())
app.use("/auth",router);
// Добавляем заголовки CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ' http://localhost:5173/'); // Замените на домен вашего клиентского приложения
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors());

const start=()=>{ //запускаем наш сервер
  try{
    app.listen(PORT,()=>console.log(`server started on port ${PORT}`))
  }catch(e){
    console.log(e);
  }
}

start()