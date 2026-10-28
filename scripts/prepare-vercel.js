const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('[AIS Build] Detected PostgreSQL connection string. Adjusting Prisma provider to "postgresql"...');
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema);

  if (process.env.VERCEL) {
    console.log('[AIS Build] Running in Vercel environment with PostgreSQL. Initializing schema...');
    try {
      execSync('npx prisma db push --skip-generate --accept-data-loss', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: dbUrl }
      });
      console.log('[AIS Build] Seeding demo accounts and master data...');
      execSync('node prisma/seed.js', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: dbUrl }
      });
      console.log('[AIS Build] Database initialization completed successfully.');
    } catch (err) {
      console.warn('[AIS Build] Note during auto-migration/seed:', err.message);
    }
  }
} else {
  console.log('[AIS Build] SQLite datasource provider active.');
  const dbFile = path.join(__dirname, '..', 'prisma', 'school.db');
  if (!fs.existsSync(dbFile)) {
    console.log('[AIS Build] school.db not found. Initializing SQLite database...');
    try {
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('[AIS Build] SQLite database initialized successfully.');
    } catch (err) {
      console.warn('[AIS Build] SQLite setup notice:', err.message);
    }
  }
}

