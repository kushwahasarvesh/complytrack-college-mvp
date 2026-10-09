CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE businesses (
    id UUID PRIMARY KEY,
    owner_email VARCHAR(320) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    name VARCHAR(160) NOT NULL,
    business_type VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    registration_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_businesses_owner ON businesses(owner_email);

CREATE TABLE compliance_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    filing_type VARCHAR(80) NOT NULL,
    frequency VARCHAR(30) NOT NULL,
    jurisdiction VARCHAR(80) NOT NULL,
    day_of_month INTEGER,
    next_due_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT chk_day_of_month CHECK (day_of_month IS NULL OR day_of_month BETWEEN 1 AND 31)
);

CREATE TABLE deadlines (
    id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES compliance_rules(id),
    owner_email VARCHAR(320) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UPCOMING',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT chk_deadline_status CHECK (status IN ('UPCOMING','DUE_SOON','OVERDUE','COMPLETED'))
);
CREATE INDEX idx_deadlines_owner_due_date ON deadlines(owner_email, due_date);

INSERT INTO compliance_rules (id, name, filing_type, frequency, jurisdiction, day_of_month, next_due_date, active, created_at)
VALUES
 ('10000000-0000-0000-0000-000000000001', 'GST Return — Demo Rule', 'GST', 'MONTHLY', 'India (demo)', 20, CURRENT_DATE + 14, TRUE, CURRENT_TIMESTAMP),
 ('10000000-0000-0000-0000-000000000002', 'TDS Return — Demo Rule', 'TDS', 'QUARTERLY', 'India (demo)', NULL, CURRENT_DATE + 28, TRUE, CURRENT_TIMESTAMP),
 ('10000000-0000-0000-0000-000000000003', 'Trade License Renewal — Demo Rule', 'LICENSE_RENEWAL', 'YEARLY', 'Local authority (demo)', NULL, CURRENT_DATE + 45, TRUE, CURRENT_TIMESTAMP);
