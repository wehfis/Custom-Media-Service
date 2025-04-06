import 'dotenv/config';

export class ConfigProvider {
  private readonly config = {
    port: process.env.PORT || 3000,
    database: {
      user: process.env.DB_USER || '',
      host: process.env.DB_HOST || '',
      name: process.env.DB_NAME || '',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 4000,
    },
    aws: {
      s3: {
        accessKey: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        region: process.env.S3_REGION || '',
        bucketName: process.env.S3_BUCKET_NAME || '',
      },
    },
  };

  get<T extends keyof typeof this.config>(key: T): (typeof this.config)[T] {
    return this.config[key];
  }
}

export default new ConfigProvider();
