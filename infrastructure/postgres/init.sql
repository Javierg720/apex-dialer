-- Initial Postgres bootstrap for Apex Dialer.
-- Runs once on first volume creation. Real schema lives in Alembic.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Dedicated schema so application tables don't collide with system objects.
CREATE SCHEMA IF NOT EXISTS apex;

-- Give the app role full rights inside the apex schema.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'apex') THEN
    EXECUTE 'GRANT ALL ON SCHEMA apex TO apex';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA apex GRANT ALL ON TABLES TO apex';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA apex GRANT ALL ON SEQUENCES TO apex';
  END IF;
END
$$;
