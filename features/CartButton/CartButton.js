import { Header } from "../../modules/Header/Header";
import { ApiService } from "../../services/ApiService";

export class CartButton {
  constructor(className, text) {
    this.className = className;
    this.text = text;
  }

  create(id) {
    const button = document.createElement("button");
    button.classList.add(this.className);
    button.dataset.id = id;
    button.textContent = this.text;

    button.addEventListener("click", async () => {
      let result = await new ApiService().postProductToCart(id);
      new Header().changeCount(result.data.totalCount);
    });

    return button;
  }
}
