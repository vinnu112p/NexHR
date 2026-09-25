import { Pool } from 'pg';
import bcrypt from 'bcrypt';

export const initSeed = async (pool: Pool) => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Default updates for salary structure ids
  try {
    await pool.query("UPDATE contracts SET salary_structure_id = 'struct_1' WHERE salary_structure_id IS NULL");
    await pool.query("UPDATE contracts SET salary_structure_id = 'struct_3' WHERE employee_id = 'emp_amara'");
    await pool.query("UPDATE contracts SET salary_structure_id = 'struct_2' WHERE employee_id = 'emp_admin'");
  } catch {}

  // Populate Seed Data safely using ON CONFLICT DO NOTHING
  await pool.query(`
    INSERT INTO roles (id, name, description) VALUES
      ('employee', 'Employee', 'Own profile, attendance & leave view only'),
      ('hr_manager', 'HR Manager', 'Full HR access; blocked from Payroll'),
      ('hr_payroll_user', 'HR Payroll User', 'HR access + Payruns view & process; read-only rules'),
      ('hr_payroll_manager', 'HR Payroll Manager', 'Full HR & Payroll access including Salary Rules'),
      ('admin', 'Admin', 'Full system access including User & Role Management')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO working_schedules (id, name, total_hours_per_week) VALUES
      ('sched_std_40h', 'Standard 40h / Week (9 AM - 5 PM)', 40.00)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO working_schedule_days (id, schedule_id, day_of_week, start_time, end_time, break_hours, computed_hours) VALUES
      ('wsd_mon', 'sched_std_40h', 'Monday', '09:00', '17:00', 1.00, 7.00),
      ('wsd_tue', 'sched_std_40h', 'Tuesday', '09:00', '17:00', 1.00, 7.00),
      ('wsd_wed', 'sched_std_40h', 'Wednesday', '09:00', '17:00', 1.00, 7.00),
      ('wsd_thu', 'sched_std_40h', 'Thursday', '09:00', '17:00', 1.00, 7.00),
      ('wsd_fri', 'sched_std_40h', 'Friday', '09:00', '17:00', 1.00, 7.00)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO departments (id, name, code) VALUES
      ('dept_sales', 'Sales Operations', 'SALES'),
      ('dept_hr', 'Human Resources', 'HR'),
      ('dept_eng', 'Engineering', 'ENG'),
      ('dept_finance', 'Finance & Accounting', 'FIN')
    ON CONFLICT DO NOTHING;

    INSERT INTO employees (id, first_name, last_name, email, phone, job_position, department_id, working_schedule_id, status, private_email, bank_account, hire_date) VALUES
      ('emp_amara', 'Amara', 'Chen', 'amara.chen@nexthr.com', '+1 (555) 234-5678', 'Sales Associate', 'dept_sales', 'sched_std_40h', 'active', 'amara.personal@gmail.com', 'US98BANK1020304050', '2026-01-15'),
      ('emp_admin', 'System', 'Admin', 'admin@nexthr.com', '+1 (555) 000-0000', 'Platform Administrator', 'dept_hr', 'sched_std_40h', 'active', 'admin@nexthr.com', 'US00BANK0000000000', '2025-01-01'),
      ('emp_hrmgr', 'HR', 'Manager', 'hr.manager@nexthr.com', '+1 (555) 111-2222', 'HR Manager', 'dept_hr', 'sched_std_40h', 'active', 'hr.manager@nexthr.com', 'US11BANK1111111111', '2025-01-01'),
      ('emp_payroll', 'Payroll', 'Manager', 'payroll@nexthr.com', '+1 (555) 333-4444', 'Payroll Manager', 'dept_hr', 'sched_std_40h', 'active', 'payroll@nexthr.com', 'US33BANK3333333333', '2025-01-01')
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

    INSERT INTO contracts (id, contract_ref, contract_name, employee_id, job_position, wage, start_date, status, working_schedule_id, salary_structure_id) VALUES
      ('ct_amara_1', 'CNT-2026-001', 'Employment Contract - Amara Chen', 'emp_amara', 'Sales Associate', 4500.00, '2026-01-15', 'running', 'sched_std_40h', 'struct_3'),
      ('ct_admin_1', 'CNT-2026-002', 'Executive Contract - Admin', 'emp_admin', 'Platform Administrator', 8500.00, '2025-01-01', 'running', 'sched_std_40h', 'struct_2'),
      ('ct_hrmgr_1', 'CNT-2026-003', 'Management Contract - HR Manager', 'emp_hrmgr', 'HR Manager', 6000.00, '2025-01-01', 'running', 'sched_std_40h', 'struct_1'),
      ('ct_payroll_1', 'CNT-2026-004', 'Management Contract - Payroll Manager', 'emp_payroll', 'Payroll Manager', 6500.00, '2025-01-01', 'running', 'sched_std_40h', 'struct_1')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO time_off_types (id, name, unit, requires_allocation, is_paid, display_color) VALUES
      ('tot_paid', 'Paid Time Off (PTO)', 'Days', true, true, '#5B4FE9'),
      ('tot_sick', 'Sick Leave', 'Days', true, true, '#F59E0B'),
      ('tot_parental', 'Parental Leave', 'Days', true, true, '#3B82F6'),
      ('tot_unpaid', 'Unpaid Leave', 'Days', false, false, '#6B7280')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO time_off_allocations (id, employee_id, time_off_type_id, allocated, taken, valid_from, valid_until) VALUES
      ('alloc_amara_pto_2026', 'emp_amara', 'tot_paid', 20, 3, '2026-01-01', '2026-12-31'),
      ('alloc_amara_sick_2026', 'emp_amara', 'tot_sick', 10, 0, '2026-01-01', '2026-12-31'),
      ('alloc_admin_pto_2026', 'emp_admin', 'tot_paid', 20, 0, '2026-01-01', '2026-12-31'),
      ('alloc_admin_sick_2026', 'emp_admin', 'tot_sick', 10, 0, '2026-01-01', '2026-12-31'),
      ('alloc_hrmgr_pto_2026', 'emp_hrmgr', 'tot_paid', 20, 0, '2026-01-01', '2026-12-31'),
      ('alloc_hrmgr_sick_2026', 'emp_hrmgr', 'tot_sick', 10, 0, '2026-01-01', '2026-12-31'),
      ('alloc_payroll_pto_2026', 'emp_payroll', 'tot_paid', 20, 0, '2026-01-01', '2026-12-31'),
      ('alloc_payroll_sick_2026', 'emp_payroll', 'tot_sick', 10, 0, '2026-01-01', '2026-12-31')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO salary_structures (id, name, code, description) VALUES
      ('struct_1', 'Standard Monthly Salary', 'STD_MONTHLY', 'Default structure for full-time regular employees'),
      ('struct_2', 'Executive & Management Structure', 'EXEC_MGMT', 'Structure with high performance and supervisor allowances'),
      ('struct_3', 'Sales & Performance Structure', 'SALES_PERF', 'Structure for sales team with commission incentives')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO salary_rules (id, structure_id, code, name, category, sequence, computation_method, amount) VALUES
      ('rule_101', 'struct_1', 'BASIC', 'Basic Wage', 'BASIC', 10, 'Fixed', 4500.00),
      ('rule_102', 'struct_1', 'HRA', 'House Rent Allowance', 'ALLOWANCE', 20, 'Percentage', 40.00),
      ('rule_103', 'struct_1', 'TA', 'Transport Allowance', 'ALLOWANCE', 30, 'Fixed', 300.00),
      ('rule_104', 'struct_1', 'PF', 'Provident Fund', 'DEDUCTION', 50, 'Percentage', 12.00),
      ('rule_105', 'struct_1', 'TAX', 'Income Tax', 'DEDUCTION', 60, 'Percentage', 10.00),

      ('rule_201', 'struct_2', 'BASIC', 'Basic Wage', 'BASIC', 10, 'Fixed', 8500.00),
      ('rule_202', 'struct_2', 'HRA', 'Executive HRA', 'ALLOWANCE', 20, 'Percentage', 40.00),
      ('rule_203', 'struct_2', 'SUP_ALW', 'Executive Supervisor Allowance', 'ALLOWANCE', 30, 'Fixed', 800.00),
      ('rule_204', 'struct_2', 'TA', 'Executive Transport Allowance', 'ALLOWANCE', 40, 'Fixed', 500.00),
      ('rule_205', 'struct_2', 'PF', 'Provident Fund', 'DEDUCTION', 50, 'Percentage', 12.00),
      ('rule_206', 'struct_2', 'TAX', 'Executive Income Tax', 'DEDUCTION', 60, 'Percentage', 15.00),

      ('rule_301', 'struct_3', 'BASIC', 'Basic Wage', 'BASIC', 10, 'Fixed', 4500.00),
      ('rule_302', 'struct_3', 'COMM', 'Sales Performance Commission', 'ALLOWANCE', 20, 'Fixed', 400.00),
      ('rule_303', 'struct_3', 'TA', 'Transport Allowance', 'ALLOWANCE', 30, 'Fixed', 250.00),
      ('rule_304', 'struct_3', 'PF', 'Provident Fund', 'DEDUCTION', 50, 'Percentage', 12.00),
      ('rule_305', 'struct_3', 'TAX', 'Income Tax', 'DEDUCTION', 60, 'Percentage', 10.00)
    ON CONFLICT (id) DO NOTHING;
  `);

  // Insert users with hashed password
  await pool.query(`
    INSERT INTO users (id, email, password_hash, password, role_id, employee_id) VALUES
      ('usr_admin', 'admin@nexthr.com', $1, $1, 'admin', 'emp_admin'),
      ('usr_hrmgr', 'hr.manager@nexthr.com', $1, $1, 'hr_manager', 'emp_hrmgr'),
      ('usr_payroll', 'payroll@nexthr.com', $1, $1, 'hr_payroll_manager', 'emp_payroll'),
      ('usr_amara', 'amara.chen@nexthr.com', $1, $1, 'employee', 'emp_amara')
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  `, [hashedPassword]);

  await pool.query(`
    UPDATE users SET email = REPLACE(email, '@peoplepay360.com', '@nexthr.com') WHERE email LIKE '%@peoplepay360.com';
  `);
  await pool.query(`
    UPDATE employees SET email = REPLACE(email, '@peoplepay360.com', '@nexthr.com') WHERE email LIKE '%@peoplepay360.com';
  `);
};
