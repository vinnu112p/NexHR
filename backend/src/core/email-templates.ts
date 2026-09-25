// Email HTML templates with NexHR design styling

export function getBaseEmailLayout(title: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
    .header p { color: #e0e7ff; margin: 6px 0 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; margin: 20px 0; font-size: 14px; text-align: center; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-approved { background: #dcfce7; color: #166534; }
    .badge-refused { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #e0e7ff; color: #3730a3; }
    .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .data-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .data-table td.label { font-weight: 600; color: #475569; width: 40%; }
    .data-table td.value { color: #0f172a; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>NexHR</h1>
      <p>Intelligent HR & Payroll Management System</p>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} NexHR Platform. All rights reserved.</p>
      <p>This is an automated notification, please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function welcomeEmailTemplate(params: {
  employeeName: string;
  email: string;
  loginUrl?: string;
  tempPassword?: string;
}): string {
  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Welcome to the Team, ${params.employeeName}! 🎉</h2>
    <p style="color: #475569; line-height: 1.6;">Your NexHR account has been successfully provisioned. You now have access to your personal employee dashboard to review attendance, manage time-off requests, and inspect monthly payslips.</p>
    
    <table class="data-table">
      <tr>
        <td class="label">Portal Username:</td>
        <td class="value"><strong>${params.email}</strong></td>
      </tr>
      ${params.tempPassword ? `
      <tr>
        <td class="label">Temporary Password:</td>
        <td class="value"><code>${params.tempPassword}</code></td>
      </tr>
      ` : ''}
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${params.loginUrl || 'http://localhost:5173/login'}" class="btn">Log In to NexHR Portal</a>
    </div>

    <p style="font-size: 13px; color: #64748b;">For security reasons, please change your temporary password immediately upon your first login under Profile Settings.</p>
  `;
  return getBaseEmailLayout(`Welcome to NexHR - ${params.employeeName}`, content);
}

export function leaveStatusTemplate(params: {
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  requestedAmount: number;
  status: 'Approved' | 'Refused' | 'Pending';
  reviewerName?: string;
  notes?: string;
}): string {
  const isApproved = params.status === 'Approved';
  const badgeClass = isApproved ? 'badge-approved' : 'badge-refused';

  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Time-Off Request Update</h2>
    <p style="color: #475569; line-height: 1.6;">Hello ${params.employeeName},</p>
    <p style="color: #475569; line-height: 1.6;">Your time-off request has been reviewed by your management team:</p>

    <div style="margin: 16px 0; text-align: center;">
      <span class="badge ${badgeClass}" style="font-size: 16px; padding: 6px 16px;">${params.status.toUpperCase()}</span>
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Leave Category:</td>
        <td class="value"><strong>${params.leaveType}</strong></td>
      </tr>
      <tr>
        <td class="label">Duration:</td>
        <td class="value">${params.requestedAmount} day(s)</td>
      </tr>
      <tr>
        <td class="label">Start Date:</td>
        <td class="value">${params.startDate}</td>
      </tr>
      <tr>
        <td class="label">End Date:</td>
        <td class="value">${params.endDate}</td>
      </tr>
      ${params.reviewerName ? `
      <tr>
        <td class="label">Reviewed By:</td>
        <td class="value">${params.reviewerName}</td>
      </tr>
      ` : ''}
      ${params.notes ? `
      <tr>
        <td class="label">Reviewer Notes:</td>
        <td class="value"><em>${params.notes}</em></td>
      </tr>
      ` : ''}
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/time-off" class="btn">View Leave Balances</a>
    </div>
  `;
  return getBaseEmailLayout(`Time-Off Request ${params.status} - NexHR`, content);
}

export function payslipReadyTemplate(params: {
  employeeName: string;
  payrunName: string;
  netSalary: number;
  basicWage: number;
  grossWage: number;
  totalDeductions: number;
  periodStart: string;
  periodEnd: string;
  hasPdfAttachment?: boolean;
}): string {
  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Your Payslip is Ready 💰</h2>
    <p style="color: #475569; line-height: 1.6;">Dear ${params.employeeName},</p>
    <p style="color: #475569; line-height: 1.6;">Your salary payslip for <strong>${params.payrunName}</strong> has been finalized and processed.</p>

    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #e2e8f0;">
      <span style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">Net Disbursement Wage</span>
      <div style="font-size: 32px; font-weight: 800; color: #16a34a; margin-top: 4px;">
        $${params.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Pay Period:</td>
        <td class="value">${params.periodStart} to ${params.periodEnd}</td>
      </tr>
      <tr>
        <td class="label">Basic Wage:</td>
        <td class="value">$${params.basicWage.toFixed(2)}</td>
      </tr>
      <tr>
        <td class="label">Gross Earnings:</td>
        <td class="value">$${params.grossWage.toFixed(2)}</td>
      </tr>
      <tr>
        <td class="label">Total Deductions:</td>
        <td class="value" style="color: #dc2626;">-$${params.totalDeductions.toFixed(2)}</td>
      </tr>
    </table>

    ${params.hasPdfAttachment ? `
    <p style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 12px; font-size: 13px; color: #065f46;">
      📎 <strong>PDF Attached:</strong> Your full official salary voucher is attached to this email as a PDF.
    </p>
    ` : ''}

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/payroll/payslips" class="btn">View Payslip Online</a>
    </div>
  `;
  return getBaseEmailLayout(`Salary Payslip - ${params.payrunName}`, content);
}
