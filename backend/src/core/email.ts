import nodemailer, { type Transporter } from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  payslipId?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

interface QueuedEmail extends EmailOptions {
  id: string;
  retries: number;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.EMAIL_FROM || 'NexHR Notifications <onboarding@resend.dev>';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

// Initialize Resend Client if API key is provided
let resendClient: Resend | null = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

// Initialize Nodemailer as fallback SMTP if configured
let transporter: Transporter | null = null;
if (SMTP_USER && SMTP_PASS && SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export const isEmailConfigured = Boolean(resendClient || transporter);

// In-memory queue
const emailQueue: QueuedEmail[] = [];
let isProcessingQueue = false;

/**
 * Directly send an email and record result into email_logs table
 */
export async function sendEmailDirect(options: EmailOptions): Promise<{ success: boolean; id: string; error?: string }> {
  const emailLogId = `elog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    if (!resendClient && !transporter) {
      // Mock / Dev fallback logger when credentials are not configured
      console.log(`[Email Mock Dispatch] To: ${options.to} | Subject: ${options.subject}`);
      await query(
        `INSERT INTO email_logs (id, recipient_email, subject, payslip_id, status, error_message, sent_at)
         VALUES ($1, $2, $3, $4, 'Sent (Dev Mock)', NULL, CURRENT_TIMESTAMP)`,
        [emailLogId, options.to, options.subject, options.payslipId || null]
      );
      return { success: true, id: emailLogId };
    }

    let messageId = '';

    if (resendClient) {
      // Format attachments for Resend
      const resendAttachments = options.attachments?.map((att) => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content),
      }));

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: resendAttachments,
      });

      if (error) {
        throw new Error(error.message);
      }

      messageId = data?.id || 'resend_ok';
      console.log(`[Resend Email Sent] MessageId: ${messageId} to ${options.to}`);
    } else if (transporter) {
      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      });
      messageId = info.messageId;
      console.log(`[SMTP Email Sent] MessageId: ${messageId} to ${options.to}`);
    }

    await query(
      `INSERT INTO email_logs (id, recipient_email, subject, payslip_id, status, error_message, sent_at)
       VALUES ($1, $2, $3, $4, 'Sent', NULL, CURRENT_TIMESTAMP)`,
      [emailLogId, options.to, options.subject, options.payslipId || null]
    );

    return { success: true, id: emailLogId };
  } catch (err: any) {
    console.error(`[Email Error] Failed to send email to ${options.to}:`, err.message);

    await query(
      `INSERT INTO email_logs (id, recipient_email, subject, payslip_id, status, error_message, sent_at)
       VALUES ($1, $2, $3, $4, 'Failed', $5, CURRENT_TIMESTAMP)`,
      [emailLogId, options.to, options.subject, options.payslipId || null, err.message]
    );

    return { success: false, id: emailLogId, error: err.message };
  }
}

/**
 * Enqueue an email for non-blocking asynchronous delivery with auto-retry
 */
export function enqueueEmail(options: EmailOptions): string {
  const id = `qmail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  emailQueue.push({ ...options, id, retries: 0 });
  processQueue();
  return id;
}

async function processQueue() {
  if (isProcessingQueue || emailQueue.length === 0) return;
  isProcessingQueue = true;

  while (emailQueue.length > 0) {
    const item = emailQueue.shift()!;
    const res = await sendEmailDirect(item);

    if (!res.success && item.retries < 2) {
      item.retries += 1;
      console.warn(`[Email Queue] Retrying delivery for ${item.to} (attempt ${item.retries + 1}/3)...`);
      emailQueue.push(item);
    }
  }

  isProcessingQueue = false;
}
