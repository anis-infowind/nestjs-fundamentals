import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  private readonly logDir = path.join(__dirname, '..', 'logs');
  private readonly logFile = path.join(this.logDir, 'myLogFile.log');

  private formatLog(entry: string): string {
    return `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Chicago',
    }).format(new Date())}\t${entry}\n`;
  }

  private async ensureLogDirectoryExists() {
    try {
      if (!fs.existsSync(this.logDir)) {
        await fsPromises.mkdir(this.logDir, { recursive: true }); // ✅ ensures parent dirs
      }

      if (!fs.existsSync(this.logFile)) {
        await fsPromises.writeFile(this.logFile, '', 'utf8'); // ✅ create empty file
      }
    } catch (error) {
      console.error('Logger setup error:', error);
    }
  }

  async logToFile(entry: string) {
    const formatted = this.formatLog(entry);
    try {
      await this.ensureLogDirectoryExists();
      await fsPromises.appendFile(this.logFile, formatted);
    } catch (e) {
      console.error('Logger error:', e instanceof Error ? e.message : e);
    }
  }
  
  log(message: unknown, context?: unknown, ...rest: unknown[]): void {
    const entry = `${context}\t${message}`;
    this.logToFile(entry);
    super.log(message, context, ...rest);
  }

  error(message: unknown, stack?: unknown, context?: unknown, ...rest: unknown[]): void {
    const entry = `\t${stack}${context}\t${message}`;
    this.logToFile(entry);
    super.error(message, context, stack, ...rest);
  }

}
