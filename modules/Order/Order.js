import { addContainer } from "../addContainer";

export class Order {
    static instance = null;

    constructor() {
        if (!Order.instance) {
            Order.instance = this;
            this.element = document.createElement('section');
            this.element.classList.add('order');
            this.containerElement = addContainer(this.element, 'order__container');
            this.isMounted = false;
        }

        return Order.instance;
    }

    mount() {
        if (this.isMounted) {
            return;
        }

        document.querySelector('main').append(this.element);
        this.isMounted = true;
    }

    unmount() {
        this.element.remove();
        this.isMounted = false;
    }
}

/*

<section class="order" hidden>
      <div class="container order__container">
        <div class="order__wrapper">
          <div class="order__body">
            <div class="order__info">
              <h3 class="order__subtitle">Заказ успешно размещен</h3>
              <p class="order__price">20 000 ₽</p>
            </div>
            <p class="order__number">№43435</p>

            <div class="order__details details">
              <h4 class="details__title">Данные доставки</h4>

              <table class="details__table table">
                <tr class="table__row">
                  <td class="table__field">Получатель</td>
                  <td class="table__value">Иванов Петр Александрович</td>
                </tr>
                <tr class="table__row">
                  <td class="table__field">Телефон</td>
                  <td class="table__value">+7 (737) 346 23 00</td>
                </tr>
                <tr class="table__row">
                  <td class="table__field">E-mail</td>
                  <td class="table__value">Ivanov84@gmail.com</td>
                </tr>
                <tr class="table__row">
                  <td class="table__field">Адрес доставки</td>
                  <td class="table__value">Москва, ул. Ленина, 21, кв. 33</td>
                </tr>
                <tr class="table__row">
                  <td class="table__field">Способ оплаты</td>
                  <td class="table__value">Картой при получении</td>
                </tr>
                <tr class="table__row">
                  <td class="table__field">Способ получения</td>
                  <td class="table__value">Доставка</td>
                </tr>
              </table>

              <a href="/" class="details__btn">На главную</a>
            </div>
          </div>
        </div>
      </div>
    </section>

*/