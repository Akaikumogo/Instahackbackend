import { Controller, Post, Body, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  @Post('login')
  saveLoginData(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    if (!username || !password) {
      return { message: 'Username and password are required.' };
    }

    const filePath = path.join(__dirname, '..', 'logins.txt');
    const logEntry = `Username: ${username}, Password: ${password}\n`;

    try {
      // Fayl mavjudligini tekshirish
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const entries = fileData
          .split('\n')
          .filter((line) => line.trim() !== '');

        // Mavjud yozuvlarni tekshirish
        const isDuplicate = entries.some((entry) => entry === logEntry.trim());
        if (isDuplicate) {
          return { message: 'Login data already exists. No changes made.' };
        }
      }

      // Agar yozuv mavjud bo'lmasa, saqlash
      fs.appendFileSync(filePath, logEntry, 'utf8');
      return { message: 'Login data saved successfully!' };
    } catch (error) {
      console.error('Error saving login data:', error);
      return { message: 'Failed to save login data.' };
    }
  }
  @Get('logins')
  getLoginData() {
    const filePath = path.join(__dirname, '..', 'logins.txt');

    try {
      if (!fs.existsSync(filePath)) {
        return { message: 'No login data found.', data: [] };
      }

      const fileData = fs.readFileSync(filePath, 'utf8');
      const lines = fileData.split('\n').filter((line) => line.trim() !== ''); // Bo'sh qatorlarni o'chirish
      const data = lines.map((line) => {
        const [username, password] = line
          .split(',')
          .map((part) => part.trim().split(': ')[1]); // Ma'lumotlarni ajratish
        return { username, password };
      });

      return { message: 'Login data retrieved successfully!', data };
    } catch (error) {
      console.error('Error reading login data:', error);
      return { message: 'Failed to retrieve login data.', data: [] };
    }
  }
}
