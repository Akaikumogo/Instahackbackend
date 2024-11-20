import { Controller, Post, Body } from '@nestjs/common';
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
        return { message: 'No login data found.' };
      }

      const data = fs.readFileSync(filePath, 'utf8');
      return { message: 'Login data retrieved successfully!', data };
    } catch (error) {
      console.error('Error reading login data:', error);
      return { message: 'Failed to retrieve login data.' };
    }
  }
}
