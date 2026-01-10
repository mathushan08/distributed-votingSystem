-- =========================================================
-- Distributed Voting System – Final Schema (Option A)
-- =========================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT users_role_check
    CHECK (role IN ('ADMIN', 'USER'))
);

-- =========================================================
-- ELECTIONS
-- =========================================================
CREATE TABLE elections (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_election_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT election_time_check
    CHECK (end_time > start_time)
);

-- =========================================================
-- CANDIDATES
-- =========================================================
CREATE TABLE candidates (
  id UUID PRIMARY KEY,
  election_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_candidate_election
    FOREIGN KEY (election_id)
    REFERENCES elections(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_candidate_per_election
    UNIQUE (election_id, name)
);

-- =========================================================
-- VOTES
-- =========================================================
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  election_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  voter_id UUID NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_vote_election
    FOREIGN KEY (election_id)
    REFERENCES elections(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_vote_candidate
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_vote_voter
    FOREIGN KEY (voter_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT one_vote_per_user_per_election
    UNIQUE (election_id, voter_id)
);

-- =========================================================
-- INDEXES (performance)
-- =========================================================
CREATE INDEX idx_votes_election ON votes(election_id);
CREATE INDEX idx_votes_candidate ON votes(candidate_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);

-- =========================================================
-- SEED DATA (DEV / TEST)
-- =========================================================
INSERT INTO users (id, email, password_hash, role)
VALUES
  (gen_random_uuid(), 'admin@test.com', encode('admin123', 'base64'), 'ADMIN'),
  (gen_random_uuid(), 'test@test.com', encode('123456', 'base64'), 'USER');
