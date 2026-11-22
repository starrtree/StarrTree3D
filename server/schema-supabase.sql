CREATE SCHEMA starrtree_commerce;
REVOKE ALL ON SCHEMA starrtree_commerce FROM PUBLIC, anon, authenticated;
SET search_path=starrtree_commerce;
-- Apply only to an owner-approved, dedicated SANDBOX PostgreSQL database.
CREATE TABLE commerce_approvals (
 id uuid PRIMARY KEY, token_hash text UNIQUE NOT NULL, service_id text NOT NULL,
 phase text NOT NULL CHECK(phase IN ('purchase','recurring')), email text NOT NULL,
 reviewed boolean NOT NULL DEFAULT false, setup_delivered boolean NOT NULL DEFAULT false,
 scope text NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE commerce_capacity (
 name text PRIMARY KEY, active integer CHECK(active>=0), maximum integer NOT NULL CHECK(maximum>0), reviewed_at timestamptz
);
INSERT INTO commerce_capacity VALUES ('websites',NULL,3,NULL),('automation',NULL,1,NULL),('receptionist',NULL,1,NULL);
CREATE TABLE commerce_presets(name text PRIMARY KEY,active boolean NOT NULL DEFAULT false);
CREATE TABLE commerce_orders (
 id uuid PRIMARY KEY,service_id text NOT NULL,phase text NOT NULL,
 approval_id uuid UNIQUE REFERENCES commerce_approvals(id), email text, access_token text UNIQUE NOT NULL,
 preset text,session_id text UNIQUE,subscription_id text,subscription_status text,
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','paid','expired')),
 fulfillment text NOT NULL DEFAULT 'manual_review',created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE commerce_events(id text PRIMARY KEY,processed_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE commerce_rate_limits (key text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), hits integer NOT NULL DEFAULT 1);

ALTER TABLE commerce_approvals ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_approvals FROM PUBLIC, anon, authenticated;
ALTER TABLE commerce_capacity ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_capacity FROM PUBLIC, anon, authenticated;
ALTER TABLE commerce_presets ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_presets FROM PUBLIC, anon, authenticated;
ALTER TABLE commerce_orders ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_orders FROM PUBLIC, anon, authenticated;
ALTER TABLE commerce_events ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_events FROM PUBLIC, anon, authenticated;
ALTER TABLE commerce_rate_limits ENABLE ROW LEVEL SECURITY; REVOKE ALL ON commerce_rate_limits FROM PUBLIC, anon, authenticated;
