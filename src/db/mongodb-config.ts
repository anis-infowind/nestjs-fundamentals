import { ConfigModule, ConfigService } from "@nestjs/config";


export const mongoDBConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('mongodb.connetion'),
  }),
  inject: [ConfigService],
};
