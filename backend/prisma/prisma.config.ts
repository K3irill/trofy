import type { DataSourceConfig } from "prisma/config";

const config: DataSourceConfig = {
  migrate: {
    url: process.env.DATABASE_URL,
  },
};

export default config;
