import { router } from "../../main";
import { addContainer } from "../../modules/addContainer";

export class BreadCrumbs {
  static instance = null;

  constructor() {
    if (!BreadCrumbs.instance) {
      BreadCrumbs.instance = this;
      this.element = document.createElement("div");
      this.element.className = "breadcrumb";
      this.containerElement = addContainer(this.element);
    }

    return BreadCrumbs.instance;
  }

  mount(parent, data) {
    this.render(data);
    parent.append(this.element);
    router.updatePageLinks();
  }

  unmount() {
    this.element.remove();
  }

  render(list) {
    this.containerElement.textContent = "";
    const listElem = document.createElement("ul");
    listElem.className = "breadcrumb__list";

    const breadCrumbList = [{ text: "Главная", href: "/" }, ...list];

    const listItems = breadCrumbList.map((item) => {
      const listItemElem = document.createElement("li");
      listItemElem.className = "breadcrumb__item";

      const link = document.createElement("a");
      link.className = "breadcrumb__link";

      link.textContent = item.text;

      if (item.href) {
        link.href = item.href;
      }

      const separator = document.createElement("span");
      separator.className = "breadcrumb__separator";

      separator.innerHTML = "&gt;";

      listItemElem.append(link, separator);

      return listItemElem;
    });

    listElem.append(...listItems);

    this.containerElement.append(listElem);
  }
}
