/* ============================================================
   PORTFOLIO — Lê Huy Toàn
   contact.js — EmailJS form, validation, toast notification
   ============================================================

   SETUP (3 steps):
   1. Create a free account at https://www.emailjs.com
   2. Add Email Service → select Gmail → copy SERVICE_ID
   3. Create Email Template → copy TEMPLATE_ID
   4. Go to Account → copy PUBLIC_KEY
   5. Fill in 3 values in the CONFIG section below
   ============================================================ */

/* ---------- ⚙️  EMAILJS CONFIGURATION (edit 3 lines) ---------- */
const EMAILJS_CONFIG = {
  publicKey:  'Z3op78It_rYn-6vnS',    // ← dán Public Key từ EmailJS Account
  serviceId:  'service_logduh9',    // ← dán Service ID (vd: service_abc123)
  templateId: 'template_umupn4o',   // ← dán Template ID (vd: template_xyz789)
};
/* -------------------------------------------------------------- */

const IS_CONFIGURED = !Object.values(EMAILJS_CONFIG).some(v => v.startsWith('YOUR_'));

/* ---------- INIT EMAILJS ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (IS_CONFIGURED) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    document.getElementById('setupBanner').classList.add('hidden');
  }
  initContactForm();
  initCharCounter();
});

/* ---------- TOAST ---------- */
function showToast(type, title, subtitle = '') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');
  const msg   = document.getElementById('toastMsg');

  icon.textContent  = type === 'success' ? '✅' : '❌';
  msg.innerHTML     = `<strong>${title}</strong><span>${subtitle}</span>`;
  toast.className   = `toast ${type} show`;

  setTimeout(() => { toast.classList.remove('show'); }, 5000);
}

/* ---------- CHARACTER COUNTER ---------- */
function initCharCounter() {
  const textarea = document.getElementById('msgField');
  const counter  = document.getElementById('charCount');
  if (!textarea || !counter) return;
  const MAX = 1000;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / ${MAX}`;
    counter.className = 'char-count';
    if (len > MAX * 0.9) counter.classList.add('warn');
    if (len > MAX)       counter.classList.add('over');
  });
}

/* ---------- VALIDATION ---------- */
function validateForm(data) {
  const errors = [];
  if (!data.name.trim() || data.name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push('Invalid email address.');
  if (!data.subject.trim() || data.subject.trim().length < 4)
    errors.push('Subject must be at least 4 characters.');
  if (!data.message.trim() || data.message.trim().length < 20)
    errors.push('Message must be at least 20 characters.');
  return errors;
}

/* ---------- FORM HANDLER ---------- */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('sendBtn');
  const status  = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';  // reset

    const data = {
      name:    document.getElementById('nameField').value,
      email:   document.getElementById('emailField').value,
      subject: document.getElementById('subjectField').value,
      message: document.getElementById('msgField').value,
      time:    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    };

    /* Validate */
    const errors = validateForm(data);
    if (errors.length) {
      status.className = 'form-status error';
      status.innerHTML = `⚠ ${errors[0]}`;
      return;
    }

    /* Not configured → fallback to mailto */
    if (!IS_CONFIGURED) {
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      );
      window.location.href = `mailto:huytoan709@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
      showToast('success', 'Opening email client...', 'You are using mailto fallback mode.');
      return;
    }

    /* Send via EmailJS */
    btn.disabled = true;
    btn.classList.add('loading');

    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        from_name:    data.name,
        from_email:   data.email,
        subject:      data.subject,
        message:      data.message,
        sent_time:    data.time,
        reply_to:     data.email,
      });

      form.reset();
      document.getElementById('charCount').textContent = '0 / 1000';
      showToast('success', 'Email sent! 🎮', 'I will reply within 24 hours.');
      status.className = 'form-status success';
      status.innerHTML = '✓ Sent successfully! I will reply as soon as possible.';

    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('error', 'Send failed', 'Please try again or contact via email directly.');
      status.className = 'form-status error';
      status.innerHTML = '✗ An error occurred. Please try again or email directly.';
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
}
