// นำเข้าโมดูลที่จำเป็น
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');

// กำหนดค่า dotenv
dotenv.config();

// สร้างอินสแตนซ์ของ Express
const app = express();

// ตั้งค่า body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ตั้งค่า EJS เป็น View Engine
app.set('view engine', 'ejs');

// ตั้งค่าโฟลเดอร์ public สำหรับไฟล์ static
app.use(express.static('public'));

// ตั้งค่าพอร์ต
const PORT = process.env.PORT || 3000;

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.render('index');
});

// ตัวแปรสำหรับเก็บข้อมูลบอทและการตั้งค่า
let googleSheetBot = {
    token: null,
    botInfo: null,
    credentials: null,
    spreadsheetId: null
  };
  
  // แสดงหน้าเมนูบอท Google Sheet
  app.get('/google-sheet-bot', (req, res) => {
    res.render('google-sheet-bot', { bot: googleSheetBot });
  });
  
  // เส้นทางสำหรับเพิ่มบอท (รับ TOKEN)
  app.get('/google-sheet-bot/add-bot', (req, res) => {
    res.render('add-google-sheet-bot');
  });
  
  app.post('/google-sheet-bot/add-bot', (req, res) => {
    const token = req.body.token;
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(token);
  
    bot.getMe()
      .then((botInfo) => {
        // เก็บข้อมูลบอท
        googleSheetBot.token = token;
        googleSheetBot.botInfo = botInfo;
        res.redirect('/google-sheet-bot');
      })
      .catch((error) => {
        console.error(error);
        res.send('ไม่สามารถเชื่อมต่อกับบอทได้ กรุณาตรวจสอบ TOKEN');
      });
  });
  
  // เส้นทางสำหรับอัปโหลดไฟล์ Credential
  const upload = multer({ dest: 'uploads/' });
  
  app.get('/google-sheet-bot/upload-credentials', (req, res) => {
    res.render('upload-credentials');
  });
  
  app.post('/google-sheet-bot/upload-credentials', upload.single('credentials'), (req, res) => {
    if (!req.file) {
      return res.send('กรุณาอัปโหลดไฟล์ Credential');
    }
    // เก็บข้อมูลไฟล์ Credential
    googleSheetBot.credentials = req.file.path;
    res.redirect('/google-sheet-bot');
  });
  
  // เส้นทางสำหรับกำหนดค่า Spreadsheet ID
  app.get('/google-sheet-bot/set-spreadsheet', (req, res) => {
    res.render('set-spreadsheet');
  });
  
  app.post('/google-sheet-bot/set-spreadsheet', (req, res) => {
    const spreadsheetId = req.body.spreadsheetId;
    googleSheetBot.spreadsheetId = spreadsheetId;
    res.redirect('/google-sheet-bot');
  });