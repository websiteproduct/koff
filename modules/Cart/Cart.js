import { API_URL } from "../../const";
import { debounce } from "../../helper";
import { ApiService } from "../../services/ApiService";
import { addContainer } from "../addContainer";

export class Cart {
  static instance = null;

  constructor() {
    if (!Cart.instance) {
      Cart.instance = this;
      this.element = document.createElement("section");
      this.element.classList.add("cart");
      this.elementContainer = addContainer(this.element, "cart__container");
      this.isMounted = false;
      this.debUpddateCart = debounce(this.updateCart.bind(this), 300);
    }

    return Cart.instance;
  }

  mount(parent, data, emptyText) {
    if (this.isMounted) {
      return;
    }

    this.elementContainer.textContent = '';

    const title = document.createElement("h2");
    title.classList.add("cart__title");
    title.textContent = "Корзина";

    this.cartData = data;

    this.elementContainer.append(title);

    if (data.products && data.products.length) {
      this.renderProducts();
      this.renderPlace();
      this.renderForm();
    } else {
      this.elementContainer.insertAdjacentHTML(
        "beforeend",
        `
          <p class="cart__empty">${emptyText || "Произошла ошибка"}</p>
        `
      );
    }

    parent.prepend(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  updateCart(id, quantity) {
    if (quantity === 0) {
      new ApiService().deleteProductFromCart(id);
      this.cartData.products = this.cartData.products.filter(
        (item) => item.id !== id
      );
    } else {
      new ApiService().updateQuantityProductToCart(id, quantity);

      this.cartData.products.forEach((item) => {
        if (item.id === id) {
          item.quantity = quantity;
        }
      });
    }

    this.cartData.totalPrice = this.cartData.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    this.cartPlaceCount.textContent = `${this.cartData.products.length} товара на сумму:`;
    this.cartPlacePrice.innerHTML = `${this.cartData.totalPrice.toLocaleString()}&nbsp;₽`;
  }

  renderProducts() {
    const cartProducts = document.createElement("ul");
    cartProducts.className = "cart__products";

    const cartItems = this.cartData.products.map((item) => {
      const cartProduct = document.createElement("li");
      cartProduct.classList.add("cart__product");

      const cartImg = document.createElement("img");
      cartImg.classList.add("cart__img");
      cartImg.src = `${API_URL}${item.images[0]}`;
      cartImg.alt = item.name;

      const cartTitleProduct = document.createElement("h3");
      cartTitleProduct.classList.add("cart__title-product");
      cartTitleProduct.textContent = item.name;

      const cartPrice = document.createElement("p");
      cartPrice.className = "cart__price";
      cartPrice.innerHTML = `${(
        item.price * item.quantity
      ).toLocaleString()}&nbsp;₽`;

      const cartArticle = document.createElement("p");
      cartArticle.classList.add("cart__article");
      cartArticle.textContent = `арт. ${item.article}`;

      const cartProductControl = document.createElement("div");
      cartProductControl.className = "cart__product-control";

      const cartProductBtnMinus = document.createElement("button");
      cartProductBtnMinus.classList.add("cart__product-btn");
      cartProductBtnMinus.textContent = "-";

      const cartProductCount = document.createElement("p");
      cartProductCount.classList.add("cart__product-count");
      cartProductCount.textContent = item.quantity;

      const cartProductBtnPlus = document.createElement("button");
      cartProductBtnPlus.classList.add("cart__product-btn");
      cartProductBtnPlus.textContent = "+";

      cartProductBtnMinus.addEventListener("click", async () => {
        if (item.quantity) {
          item.quantity--;
          cartProductCount.textContent = item.quantity;
        }

        if (item.quantity === 0) {
          cartProduct.remove();
          this.debUpddateCart(item.id, item.quantity);
          return;
        }

        cartPrice.innerHTML = `${(
          item.price * item.quantity
        ).toLocaleString()}&nbsp;₽`;

        this.debUpddateCart(item.id, item.quantity);
      });

      cartProductBtnPlus.addEventListener("click", () => {
        item.quantity++;
        cartProductCount.textContent = item.quantity;

        cartPrice.innerHTML = `${(
          item.price * item.quantity
        ).toLocaleString()}&nbsp;₽`;

        this.debUpddateCart(item.id, item.quantity);
      });

      cartProductControl.append(
        cartProductBtnMinus,
        cartProductCount,
        cartProductBtnPlus
      );
      cartProduct.append(
        cartImg,
        cartTitleProduct,
        cartPrice,
        cartArticle,
        cartProductControl
      );

      return cartProduct;
    });

    cartProducts.append(...cartItems);
    this.elementContainer.append(cartProducts);
  }
  renderPlace() {
    const count = this.cartData.products.length;
    const totalPrice = this.cartData.totalPrice;

    const cartPlace = document.createElement("div");
    cartPlace.classList.add("cart__place");

    const cartPlaceTitle = document.createElement("h3");
    cartPlaceTitle.classList.add("cart__subtitle");
    cartPlaceTitle.textContent = "Оформление";

    const cartPlaceInfo = document.createElement("div");
    cartPlaceInfo.classList.add("cart__place-info");

    this.cartPlaceCount = document.createElement("p");
    this.cartPlaceCount.classList.add("cart__place-count");
    this.cartPlaceCount.textContent = `${count} товара на сумму:`;

    this.cartPlacePrice = document.createElement("p");
    this.cartPlacePrice.classList.add("cart__place-price");
    this.cartPlacePrice.innerHTML = `${totalPrice.toLocaleString()}&nbsp;₽`;

    cartPlaceInfo.append(this.cartPlaceCount, this.cartPlacePrice);

    const cartPlaceDelivery = document.createElement("p");
    cartPlaceDelivery.classList.add("cart__place-delivery");
    cartPlaceDelivery.innerHTML = "Доставка 0&nbsp;₽";

    const cartPlaceBtn = document.createElement("button");
    cartPlaceBtn.classList.add("cart__place-btn");
    cartPlaceBtn.textContent = "Оформить заказ";
    cartPlaceBtn.type = "submit";
    cartPlaceBtn.setAttribute("form", "order");

    cartPlace.append(
      cartPlaceTitle,
      cartPlaceInfo,
      cartPlaceDelivery,
      cartPlaceBtn
    );

    this.elementContainer.append(cartPlace);
  }
  renderForm() {
    const form = document.createElement("form");
    form.classList.add("cart__form", "form-order");
    form.id = "order";
    form.method = "POST";
    form.innerHTML = `
      <h3 class="cart__subtitle cart__subtitle_form_order">Данные для доставки</h3>

      <fieldset class="form-order__fieldset form-order__fieldset_input">
        <input type="text" class="form-order__input" name="name" placeholder="Фамилия Имя Отчество" required>
        <input type="tel" class="form-order__input" name="phone" placeholder="Телефон" required>
        <input type="email" class="form-order__input" name="email" placeholder="E-mail" required>
        <input type="text" class="form-order__input" name="address" placeholder="Адрес доставки">

        <textarea name="comments" class="form-order__textarea" placeholder="Комментарий к заказу"></textarea>
      </fieldset>
      <fieldset class="form-order__fieldset form-order__fieldset_radio">
        <legend class="form-order__legend">Доставка</legend>

        <label class="form-order__label radio">
          <input type="radio" class="radio__input" value="delivery" name="deliveryType" required>Доставка
        </label>
        <label class="form-order__label radio">
          <input type="radio" class="radio__input" value="pickup" name="deliveryType" required>Самовывоз
        </label>
      </fieldset>
      <fieldset class="form-order__fieldset form-order__fieldset_radio">
        <legend class="form-order__legend">Оплата</legend>

        <label class="form-order__label radio">
          <input type="radio" class="radio__input" value="card" name="paymentType" required>Картой при получении
        </label>
        <label class="form-order__label radio">
          <input type="radio" class="radio__input" value="cash" name="paymentType" required>Наличными при получении
        </label>
      </fieldset>
    `;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("отправка заказа");
    });

    this.elementContainer.append(form);
  }
}
