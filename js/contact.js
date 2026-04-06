/* ============================================================
   PORTFOLIO — Lê Huy Toàn
   contact.js — EmailJS form, validation, toast notification
   ============================================================

   SETUP (3 bước):
   1. Tạo tài khoản miễn phí tại https://www.emailjs.com
   2. Add Email Service → chọn Gmail → copy SERVICE_ID
   3. Create Email Template → copy TEMPLATE_ID
   4. Vào Account → copy PUBLIC_KEY
   5. Điền 3 giá trị vào phần CONFIG bên dưới
   ============================================================ */

/* ---------- ⚙️  CẤU HÌNH EMAILJS (chỉnh 3 dòng này) ---------- */
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
    errors.push('Tên cần ít nhất 2 ký tự.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push('Email không hợp lệ.');
  if (!data.subject.trim() || data.subject.trim().length < 4)
    errors.push('Tiêu đề cần ít nhất 4 ký tự.');
  if (!data.message.trim() || data.message.trim().length < 20)
    errors.push('Tin nhắn cần ít nhất 20 ký tự.');
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
        `Tên: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      );
      window.location.href = `mailto:huytoan709@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
      showToast('success', 'Mở ứng dụng email...', 'Bạn đang dùng chế độ mailto fallback.');
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
      showToast('success', 'Email đã được gửi! 🎮', 'Tôi sẽ phản hồi trong 24 giờ.');
      status.className = 'form-status success';
      status.innerHTML = '✓ Gửi thành công! Tôi sẽ phản hồi sớm nhất.';

    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('error', 'Gửi thất bại', 'Thử lại hoặc liên hệ qua email trực tiếp.');
      status.className = 'form-status error';
      status.innerHTML = '✗ Có lỗi xảy ra. Vui lòng thử lại hoặc email trực tiếp.';
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
}
