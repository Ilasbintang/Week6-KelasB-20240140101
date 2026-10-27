// ===== Form: DOM & Event Handling =====
const form = document.getElementById("workshop-form");
const feedbackEl = document.getElementById("feedback");
const listEl = document.getElementById("peserta-list");
const emptyEl = document.getElementById("empty-state");
const totalEl = document.getElementById("total-peserta");
const catatanEl = document.getElementById("catatan");
const counterEl = document.getElementById("catatan-counter");

const pesertaList = [];

// ---------- Aturan validasi tiap field ----------
const validators = {
  nama(value) {
    if (!value.trim()) return "Nama wajib diisi.";
    if (value.trim().length < 3) return "Nama minimal 3 karakter.";
    if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email(value) {
    if (!value.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Format email belum benar, contoh: nama@email.com.";
    return "";
  },
  telepon(value) {
    if (!value.trim()) return "Nomor HP wajib diisi.";
    if (!/^08\d{8,11}$/.test(value.trim())) return "Nomor HP harus diawali 08 dan 10-13 digit.";
    return "";
  },
  workshop(value) {
    return value ? "" : "Pilih salah satu workshop.";
  },
  level() {
    return form.elements["level"].value ? "" : "Pilih level kemampuanmu.";
  },
  setuju() {
    return form.elements["setuju"].checked ? "" : "Centang pernyataan ini untuk melanjutkan.";
  },
};

function setFieldState(name, message) {
  const errorEl = document.getElementById(name + "-error");
  const field = errorEl.closest(".field");
  errorEl.textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.classList.toggle("valid", !message);
}

function validateField(name) {
  const message = validators[name](form.elements[name].value || "");
  setFieldState(name, message);
  return message === "";
}

function validateAll() {
  // jalankan semua validator dulu agar semua pesan error muncul sekaligus
  const results = Object.keys(validators).map(validateField);
  return results.every(Boolean);
}

// ---------- Umpan balik ----------
function showFeedback(type, title, text) {
  feedbackEl.className = "feedback " + type;
  feedbackEl.replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = text;
  feedbackEl.append(strong, span);
  feedbackEl.hidden = false;
}

// ---------- Render daftar peserta ----------
function renderPeserta() {
  listEl.replaceChildren();
  pesertaList.forEach((p) => {
    const li = document.createElement("li");
    li.className = "peserta-item";

    const nama = document.createElement("div");
    nama.className = "nama";
    nama.textContent = p.nama;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = p.workshop + " (" + p.level + ")";

    const kontak = document.createElement("div");
    kontak.className = "meta";
    kontak.textContent = p.email + " | " + p.telepon;

    li.append(nama, meta, kontak);
    if (p.catatan) {
      const note = document.createElement("div");
      note.className = "meta";
      note.textContent = "Catatan: " + p.catatan;
      li.appendChild(note);
    }
    listEl.appendChild(li);
  });
  totalEl.textContent = pesertaList.length;
  emptyEl.hidden = pesertaList.length > 0;
}

// ---------- Event listener ----------
// 1) input: validasi langsung saat mengetik
["nama", "email", "telepon"].forEach((name) => {
  form.elements[name].addEventListener("input", () => validateField(name));
});

// 2) change: select, radio, checkbox
form.elements["workshop"].addEventListener("change", () => validateField("workshop"));
form.elements["setuju"].addEventListener("change", () => validateField("setuju"));
form.querySelectorAll('input[name="level"]').forEach((radio) => {
  radio.addEventListener("change", () => validateField("level"));
});

// 3) input: penghitung karakter catatan
catatanEl.addEventListener("input", () => {
  counterEl.textContent = catatanEl.value.length + " / " + catatanEl.maxLength + " karakter";
});

// 4) submit: proses data
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateAll()) {
    showFeedback("error", "Form belum lengkap", "Periksa kolom yang ditandai merah lalu coba lagi.");
    return;
  }

  const peserta = {
    nama: form.elements["nama"].value.trim(),
    email: form.elements["email"].value.trim(),
    telepon: form.elements["telepon"].value.trim(),
    workshop: form.elements["workshop"].value,
    level: form.elements["level"].value,
    catatan: catatanEl.value.trim(),
  };

  pesertaList.push(peserta);
  renderPeserta();
  showFeedback(
    "success",
    "Pendaftaran berhasil",
    peserta.nama + " terdaftar di workshop " + peserta.workshop + "."
  );

  form.reset();
});

// 5) reset: bersihkan tampilan validasi
form.addEventListener("reset", () => {
  counterEl.textContent = "0 / " + catatanEl.maxLength + " karakter";
  document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
});
