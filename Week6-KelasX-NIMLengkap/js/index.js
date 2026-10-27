// ===== Fetch API: data produk dari DummyJSON =====
const API_URL = "https://dummyjson.com/products";

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMsgEl = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const listEl = document.getElementById("product-list");
const countEl = document.getElementById("count");

function formatUSD(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function showLoading(isLoading) {
  loadingEl.hidden = !isLoading;
}

function showError(message) {
  errorMsgEl.textContent = message;
  errorEl.hidden = false;
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "card-img";
  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";
  imgWrap.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = product.category;

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = product.title;

  const rating = document.createElement("span");
  rating.className = "card-rating";
  rating.textContent = "Rating " + product.rating;

  const price = document.createElement("p");
  price.className = "card-price";
  price.textContent = formatUSD(product.price);

  body.append(category, title, rating, price);
  card.append(imgWrap, body);
  return card;
}

function renderProducts(products) {
  listEl.innerHTML = "";
  products.forEach((product) => listEl.appendChild(createCard(product)));
  countEl.textContent = "Menampilkan " + products.length + " produk";
  countEl.hidden = false;
}

async function loadProducts() {
  errorEl.hidden = true;
  countEl.hidden = true;
  listEl.innerHTML = "";
  showLoading(true);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Server merespons dengan status " + response.status);
    }
    const data = await response.json(); // olah response JSON

    if (!data.products || data.products.length === 0) {
      throw new Error("Tidak ada data produk yang diterima.");
    }
    renderProducts(data.products);
  } catch (err) {
    console.error(err);
    showError("Data produk gagal dimuat. " + err.message);
  } finally {
    showLoading(false);
  }
}

retryBtn.addEventListener("click", loadProducts);
document.addEventListener("DOMContentLoaded", loadProducts);
