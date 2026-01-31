function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand?.Name || ""}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.allProducts = [];
  }

  async init() {
    const list = await this.dataSource.getData();
    this.allProducts = list;
    this.renderList(list);
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  }

  searchProducts(searchTerm) {
    if (!searchTerm.trim()) {
      this.renderList(this.allProducts);
      return;
    }

    const filtered = this.allProducts.filter((item) => {
      const name = item.Name?.toLowerCase() || "";
      const brand = item.Brand?.Name?.toLowerCase() || "";
      const description = item.DescriptionHtmlSimple?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        name.includes(search) ||
        brand.includes(search) ||
        description.includes(search)
      );
    });

    this.renderList(filtered);
  }
}

export function initProductSearch(productList) {
  const searchInput = document.querySelector("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      productList.searchProducts(e.target.value);
    });
  }
}
