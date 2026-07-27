import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';
config();

const pushUrl = process.env.DATABASE_URL?.replace(':6543', ':5432');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: pushUrl,
  },
});
