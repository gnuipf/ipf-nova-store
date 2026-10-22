"use strict";

/* =====================================================
   CONFIGURAÇÕES
   ===================================================== */

const CONFIG = {
  imageBase:
    "https://raw.githubusercontent.com/gnuipf/ipf_store/main/",

  whatsapp: "5548996196699"
};


/* =====================================================
   CATÁLOGO
   Confira os nomes exatos das imagens no repositório.
   ===================================================== */

const products = [
  {
    id: "camiseta-louder",
    name: "Louder, Faster, Heavier",
    category: "camiseta",
    categoryLabel: "Camiseta",
    price: 89.90,
    images: [
      "louder, faster, heavier - frente.png",
      "louder, faster, heavier - verso.png"
    ],
    description: "Camiseta Louder, Faster, Heavier."
  },
  {
    id: "camiseta-toupeira",
    name: "Toupeira",
    category: "camiseta",
    categoryLabel: "Camiseta",
    price: 89.90,
    images: [
      "toupeira_frente.png",
      "toupeira_verso.png"
    ],
    description: "Camiseta Toupeira da Inaudível Por Favor."
  },
  {
    id: "bottom-apoie",
    name: "Bottom Apoie a Cena",
    category: "bottom",
    categoryLabel: "Bottom",
    price: 19.90,
    images: [
      "bottom - apoie a cena.png"
    ],
    description: "Bottom Apoie a Cena."
  },
  {
    id: "bottom-personalizavel",
    name: "Bottom Personalizável",
    category: "bottom",
    categoryLabel: "Bottom",
    price: 7.00,
    images: [
      "bottom personalizavel.png"
    ],
    description: "Bottom personalizável."
  }
];


/* =====================================================
   ELEMENTOS DA PÁGINA
   ===================================================== */

const productGrid = document.getElementById("product-grid");
const productTotal = document.getElementById("product-total");
const searchInput = document.getElementById("product-search");
const filterButtons = document.getElementById("filter-buttons");

let activeFilter = "todos";
let searchTerm = "";


/* =====================================================
   FUNÇÕES AUXILIARES
   ===================================================== */

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}


function getImageUrl(filename) {
  return CONFIG.imageBase + encodeURIComponent(filename);
}


/* =====================================================
   FILTRO E BUSCA
   ===================================================== */

function getFilteredProducts() {
  return products.filter(product => {
    const matchesFilter =
      activeFilter === "todos" ||
      product.category === activeFilter;

    const normalizedSearch = searchTerm
      .trim()
      .toLocaleLowerCase("pt-BR");

    const searchableText = [
      product.name,
      product.categoryLabel,
      product.description
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    const matchesSearch =
      !normalizedSearch ||
      searchableText.includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });
}


/* =====================================================
   RENDERIZAÇÃO DOS PRODUTOS
   ===================================================== */

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (productTotal) {
    productTotal.textContent =
      `${String(filteredProducts.length).padStart(2, "0")} PRODUTOS`;
  }

  if (!productGrid) return;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <p class="no-results">
        Nenhum produto encontrado.
        Tente outra busca ou categoria.
      </p>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map(product => {
      const images = product.images || [];
      const image = getImageUrl(images[0] || "");
      const hasMultipleImages = images.length > 1;

      return `
        <article class="product-card" data-product-id="${escapeHTML(product.id)}">
          <div class="product-image-wrap">

            <img
              class="product-image"
              src="${image}"
              data-image-index="0"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
              onerror="this.onerror=null;this.style.display='none';"
            >

            ${
              hasMultipleImages
                ? `
                  <button
                    class="image-arrow image-arrow-prev"
                    type="button"
                    data-image-direction="-1"
                    aria-label="Imagem anterior de ${escapeHTML(product.name)}"
                  >&#10094;</button>

                  <button
                    class="image-arrow image-arrow-next"
                    type="button"
                    data-image-direction="1"
                    aria-label="Próxima imagem de ${escapeHTML(product.name)}"
                  >&#10095;</button>

                  <span class="image-counter" aria-live="polite">
                    1 / ${images.length}
                  </span>
                `
                : ""
            }

          </div>

          <div class="product-details">
            <p class="product-category">
              ${escapeHTML(product.categoryLabel)}
            </p>

            <h3 class="product-title">
              ${escapeHTML(product.name)}
            </h3>

            <p class="product-price">
              ${formatPrice(product.price)}
              <small>Preço por unidade</small>
            </p>

            <div class="product-actions">
              <button
                class="add-to-cart"
                type="button"
                data-whatsapp="${escapeHTML(product.id)}"
              >
                CONSULTAR NO WHATSAPP
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

/* =====================================================
   EVENTOS DA BUSCA E DOS FILTROS
   ===================================================== */

if (searchInput) {
  searchInput.addEventListener("input", event => {
    searchTerm = event.target.value;
    renderProducts();
  });
}


if (filterButtons) {
  filterButtons.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;

    filterButtons
      .querySelectorAll("[data-filter]")
      .forEach(filterButton => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);

        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

    renderProducts();
  });
}


/* =====================================================
   REDIRECIONAMENTO PARA O WHATSAPP
   Cada botão prepara uma mensagem para o produto.
   ===================================================== */

function openWhatsApp(productId) {
  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;

  const phone = CONFIG.whatsapp.replace(/\D/g, "");

  const message = [
    "Olá! Vim pela IPF Store e tenho interesse neste produto:",
    "",
    `Produto: ${product.name}`,
    `Categoria: ${product.categoryLabel}`,
    `Preço anunciado: ${formatPrice(product.price)}`,
    "",
    "Gostaria de saber mais informações sobre disponibilidade, tamanhos ou personalização, quando aplicável, e frete."
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
}


if (productGrid) {
  productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-whatsapp]");

    if (!button) return;

    openWhatsApp(button.dataset.whatsapp);
  });
}


/* =====================================================
   ANO AUTOMÁTICO NO RODAPÉ
   ===================================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

renderProducts();
