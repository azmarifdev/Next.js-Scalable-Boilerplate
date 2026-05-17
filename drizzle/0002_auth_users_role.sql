ALTER TABLE "auth_users"
ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'user';

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'auth_users_role_check'
	) THEN
		ALTER TABLE "auth_users"
			ADD CONSTRAINT "auth_users_role_check" CHECK (role IN ('admin', 'user'));
	END IF;
END $$;
