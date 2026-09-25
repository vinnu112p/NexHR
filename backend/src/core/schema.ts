import { Pool } from 'pg';

export const initSchema = async (pool: Pool) => {
  // 1. Create all Tables if they do not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS working_schedules (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      total_hours_per_week NUMERIC(5, 2) DEFAULT 40.00,
      hours_per_week NUMERIC(5, 2) DEFAULT 40.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS working_schedule_days (
      id VARCHAR(50) PRIMARY KEY,
      schedule_id VARCHAR(50) REFERENCES working_schedules(id) ON DELETE CASCADE,
      day_of_week VARCHAR(20) NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      break_hours NUMERIC(4, 2) DEFAULT 1.00,
      computed_hours NUMERIC(4, 2) DEFAULT 7.00
    );

    CREATE TABLE IF NOT EXISTS departments (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(20) UNIQUE,
      manager_id VARCHAR(50),
      parent_id VARCHAR(50) REFERENCES departments(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id VARCHAR(50) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(50),
      job_position VARCHAR(100) NOT NULL,
      department_id VARCHAR(50) REFERENCES departments(id),
      manager_id VARCHAR(50) REFERENCES employees(id),
      working_schedule_id VARCHAR(50) REFERENCES working_schedules(id),
      status VARCHAR(20) DEFAULT 'active',
      private_email VARCHAR(150),
      bank_account VARCHAR(50),
      hire_date DATE NOT NULL,
      date_of_joining DATE,
      bank_account_number VARCHAR(50),
      bank_name VARCHAR(100),
      bank_ifsc VARCHAR(50),
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
      employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT TRUE,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id VARCHAR(50) PRIMARY KEY,
      contract_ref VARCHAR(50) UNIQUE NOT NULL,
      contract_name VARCHAR(150),
      employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      job_position VARCHAR(100) NOT NULL,
      wage NUMERIC(12, 2) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE,
      status VARCHAR(20) DEFAULT 'running',
      working_schedule_id VARCHAR(50) REFERENCES working_schedules(id),
      salary_structure_id VARCHAR(50),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS time_off_types (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      unit VARCHAR(20) DEFAULT 'Days',
      requires_allocation BOOLEAN DEFAULT TRUE,
      requires_approval BOOLEAN DEFAULT TRUE,
      affects_payroll BOOLEAN DEFAULT FALSE,
      is_paid BOOLEAN DEFAULT TRUE,
      display_color VARCHAR(20),
      approval_workflow VARCHAR(50) DEFAULT 'by_hr',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS time_off_allocations (
      id VARCHAR(50) PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      time_off_type_id VARCHAR(50) REFERENCES time_off_types(id),
      allocated NUMERIC(5, 2) NOT NULL,
      taken NUMERIC(5, 2) DEFAULT 0,
      valid_from DATE NOT NULL,
      valid_until DATE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS time_off_requests (
      id VARCHAR(50) PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      time_off_type_id VARCHAR(50) REFERENCES time_off_types(id),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      requested_amount NUMERIC(5, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      approved_by VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendances (
      id VARCHAR(50) PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      attendance_date DATE,
      check_in TIMESTAMP WITH TIME ZONE,
      check_out TIMESTAMP WITH TIME ZONE,
      worked_hours NUMERIC(5, 2),
      worked_minutes INT,
      overtime_hours NUMERIC(5, 2) DEFAULT 0,
      overtime_minutes INT DEFAULT 0,
      status VARCHAR(50),
      is_manual_correction BOOLEAN DEFAULT FALSE,
      is_manual_edit BOOLEAN DEFAULT FALSE,
      audit_note TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS salary_structures (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50),
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS salary_rules (
      id VARCHAR(50) PRIMARY KEY,
      structure_id VARCHAR(50) REFERENCES salary_structures(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50) NOT NULL,
      category VARCHAR(50) NOT NULL,
      sequence INT NOT NULL,
      computation_method VARCHAR(50) DEFAULT 'Fixed',
      operation VARCHAR(50),
      basis VARCHAR(50),
      amount NUMERIC(12, 2),
      value NUMERIC(12, 4),
      formula TEXT,
      condition_expression TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_struct_code UNIQUE(structure_id, code)
    );

    CREATE TABLE IF NOT EXISTS payruns (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      structure_id VARCHAR(50),
      salary_structure_id VARCHAR(50),
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'Draft',
      employee_count INT DEFAULT 0,
      total_gross NUMERIC(12, 2) DEFAULT 0,
      total_net NUMERIC(12, 2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payslips (
      id VARCHAR(50) PRIMARY KEY,
      payrun_id VARCHAR(50) REFERENCES payruns(id) ON DELETE CASCADE,
      employee_id VARCHAR(50) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      contract_id VARCHAR(50) REFERENCES contracts(id),
      salary_structure_id VARCHAR(50),
      period_start DATE,
      period_end DATE,
      worked_days NUMERIC(5, 2) DEFAULT 22,
      basic_wage NUMERIC(12, 2) DEFAULT 0,
      gross_wage NUMERIC(12, 2) DEFAULT 0,
      gross_salary NUMERIC(12, 2) DEFAULT 0,
      total_deductions NUMERIC(12, 2) DEFAULT 0,
      net_wage NUMERIC(12, 2) DEFAULT 0,
      net_salary NUMERIC(12, 2) DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Draft',
      pdf_path TEXT,
      email_status VARCHAR(50) DEFAULT 'NOT_SENT',
      emailed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payslip_lines (
      id VARCHAR(50) PRIMARY KEY,
      payslip_id VARCHAR(50) REFERENCES payslips(id) ON DELETE CASCADE,
      salary_rule_id VARCHAR(50) REFERENCES salary_rules(id),
      rule_id VARCHAR(50),
      name VARCHAR(150),
      code VARCHAR(50),
      category VARCHAR(50),
      sequence INT DEFAULT 10,
      amount NUMERIC(12, 2) NOT NULL,
      operation VARCHAR(50),
      basis VARCHAR(50),
      rule_value NUMERIC(12, 4)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(50) PRIMARY KEY,
      table_name VARCHAR(100) NOT NULL,
      record_id VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      changed_by VARCHAR(50),
      old_values JSONB,
      new_values JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS email_logs (
      id VARCHAR(50) PRIMARY KEY,
      recipient_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      payslip_id VARCHAR(50) REFERENCES payslips(id),
      status VARCHAR(50) NOT NULL,
      error_message TEXT,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Helper to safely execute column additions / index creations
  const safeExec = async (sql: string) => {
    try {
      await pool.query(sql);
    } catch {
      // Ignore if column or index already exists
    }
  };

  // 2. Safe column migrations
  const columnMigrations = [
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS private_email VARCHAR(150)",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account VARCHAR(50)",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_joining DATE",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(50)",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100)",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50)",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS avatar_url TEXT",
    "ALTER TABLE employees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS code VARCHAR(20)",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS manager_id VARCHAR(50)",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS parent_id VARCHAR(50)",
    "ALTER TABLE departments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS contract_name VARCHAR(150)",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS salary_structure_id VARCHAR(50)",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS contract_ref VARCHAR(50)",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS working_schedule_id VARCHAR(50)",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS schedule_id VARCHAR(50)",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS notes TEXT",
    "ALTER TABLE contracts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS approval_workflow VARCHAR(50) DEFAULT 'by_hr'",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT TRUE",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS affects_payroll BOOLEAN DEFAULT FALSE",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS display_color VARCHAR(20) DEFAULT '#5B4FE9'",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_types ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_allocations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_allocations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_requests ADD COLUMN IF NOT EXISTS approved_by VARCHAR(50)",
    "ALTER TABLE time_off_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE time_off_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS attendance_date DATE",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS worked_minutes INT",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS overtime_minutes INT DEFAULT 0",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS status VARCHAR(50)",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS is_manual_correction BOOLEAN DEFAULT FALSE",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS is_manual_edit BOOLEAN DEFAULT FALSE",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS audit_note TEXT",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS notes TEXT",
    "ALTER TABLE attendances ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE working_schedules ADD COLUMN IF NOT EXISTS total_hours_per_week NUMERIC(5, 2) DEFAULT 40.00",
    "ALTER TABLE working_schedules ADD COLUMN IF NOT EXISTS hours_per_week NUMERIC(5, 2) DEFAULT 40.00",
    "ALTER TABLE working_schedules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE working_schedule_days ADD COLUMN IF NOT EXISTS break_hours NUMERIC(4, 2) DEFAULT 1.00",
    "ALTER TABLE working_schedule_days ADD COLUMN IF NOT EXISTS computed_hours NUMERIC(4, 2) DEFAULT 7.00",
    "ALTER TABLE salary_structures ADD COLUMN IF NOT EXISTS code VARCHAR(50)",
    "ALTER TABLE salary_structures ADD COLUMN IF NOT EXISTS description TEXT",
    "ALTER TABLE salary_structures ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
    "ALTER TABLE salary_structures ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS computation_method VARCHAR(50) DEFAULT 'Fixed'",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS operation VARCHAR(50)",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS basis VARCHAR(50)",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2)",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS value NUMERIC(12, 4)",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS formula TEXT",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS condition_expression TEXT",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
    "ALTER TABLE salary_rules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS name VARCHAR(100)",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS structure_id VARCHAR(50)",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS salary_structure_id VARCHAR(50)",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS period_start DATE",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS period_end DATE",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft'",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS employee_count INT DEFAULT 0",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS total_gross NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS total_net NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payruns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS contract_id VARCHAR(50)",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS salary_structure_id VARCHAR(50)",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS period_start DATE",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS period_end DATE",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS worked_days NUMERIC(5, 2) DEFAULT 22",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS basic_wage NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS gross_wage NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS gross_salary NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS total_deductions NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS net_wage NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS net_salary NUMERIC(12, 2) DEFAULT 0",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft'",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS pdf_path TEXT",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS email_status VARCHAR(50) DEFAULT 'NOT_SENT'",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS emailed_at TIMESTAMP WITH TIME ZONE",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS salary_rule_id VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS rule_id VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS name VARCHAR(150)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS code VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS category VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS sequence INT DEFAULT 10",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS operation VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS basis VARCHAR(50)",
    "ALTER TABLE payslip_lines ADD COLUMN IF NOT EXISTS rule_value NUMERIC(12, 4)",
  ];

  for (const sql of columnMigrations) {
    await safeExec(sql);
  }

  // 3. Database Indexes for Performance (Phase 2)
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id)",
    "CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status)",
    "CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email)",
    "CREATE INDEX IF NOT EXISTS idx_contracts_employee ON contracts(employee_id)",
    "CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status)",
    "CREATE INDEX IF NOT EXISTS idx_attendances_employee_date ON attendances(employee_id, attendance_date)",
    "CREATE INDEX IF NOT EXISTS idx_attendances_checkin ON attendances(check_in)",
    "CREATE INDEX IF NOT EXISTS idx_timeoff_requests_employee ON time_off_requests(employee_id)",
    "CREATE INDEX IF NOT EXISTS idx_timeoff_requests_status ON time_off_requests(status)",
    "CREATE INDEX IF NOT EXISTS idx_payslips_payrun ON payslips(payrun_id)",
    "CREATE INDEX IF NOT EXISTS idx_payslips_employee ON payslips(employee_id)",
    "CREATE INDEX IF NOT EXISTS idx_payslip_lines_payslip ON payslip_lines(payslip_id)",
    "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
    "CREATE INDEX IF NOT EXISTS idx_users_employee ON users(employee_id)",
    "CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(table_name, record_id)",
    "CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC)",
  ];

  for (const sql of indexes) {
    await safeExec(sql);
  }
};
