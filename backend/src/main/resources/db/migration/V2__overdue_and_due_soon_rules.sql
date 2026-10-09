INSERT INTO compliance_rules (id, name, filing_type, frequency, jurisdiction, day_of_month, next_due_date, active, created_at)
VALUES
    ('10000000-0000-0000-0000-000000000004', 'GST Return — Overdue Demo', 'GST', 'MONTHLY', 'India (demo)', 20, CURRENT_DATE - 10, TRUE, CURRENT_TIMESTAMP),
    ('10000000-0000-0000-0000-000000000005', 'TDS Return — Due Soon Demo', 'TDS', 'QUARTERLY', 'India (demo)', NULL, CURRENT_DATE + 3, TRUE, CURRENT_TIMESTAMP);
