import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
  accessTtl: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  refreshTtl: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d"
};
