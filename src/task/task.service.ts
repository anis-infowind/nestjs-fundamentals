import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  //    * * * * * *
  //  | | | | | |
  //  | | | | | day of week
  //  | | | | months
  //  | | | day of month
  //  | | hours
  //  | minutes
  //  seconds (optional)
  //  Examples
  //  * * * * * *​ every second
  //  45 * * * * *​every minute, on the 45th second
  //  0 10 * * * *​every hour, at the start of the 10th minute
  //  0 */30 9-17 * * *​ every 30 minutes between 9am and 5pm
  //  0 30 11 * * 1-5​
  //  Monday to Friday at 11:30am

  @Cron('1 * * * * *')
  myCronTask() {
    this.logger.debug('Cron Task Called');
  }
}
