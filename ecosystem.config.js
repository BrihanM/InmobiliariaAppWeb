module.exports = {
  apps: [
    {
      name: 'auth-service',
      cwd: './auth-service',
      script: 'node',
      args: 'dist/src/main.js',
      watch: false,
      env: { PORT: 4000 }
    },
    {
      name: 'property-service',
      cwd: './property-service',
      script: 'node',
      args: 'dist/src/main.js',
      watch: false,
      env: { PORT: 4100 }
    },
    {
      name: 'user-service',
      cwd: './user-service',
      script: 'node',
      args: 'dist/src/main.js',
      watch: false,
      env: { PORT: 4200 }
    }
      ,{
      name: "search-service",
      cwd: "./search-service",
      script: "node",
      args: "dist/src/main.js",
      watch: false,
      env: { PORT: 4300 }
    }
      ,{
        name: "payment-service",
        cwd: "./payment-service",
        script: "node",
        args: "dist/src/main.js",
        watch: false,
        env: { PORT: 4400 }
      }
  ]
};
