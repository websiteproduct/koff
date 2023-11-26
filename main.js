import 'normalize.css'
import './style.scss'
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { Footer } from './modules/Footer/Footer';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';
import { ApiService } from './services/ApiService';
import { Catalog } from './modules/Catalog/Catalog';

const productSider = () => {
  Promise.all([
    import('swiper/modules'),
    import('swiper'),
    import('swiper/css'),
  ]).then(([{ Navigation, Thumbs }, Swiper]) => {
    const swiperThumbnails = new Swiper.default(".product__slider-thumbnails", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const swiper2 = new Swiper.default(".product__slider-main", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".product__arrow_next",
        prevEl: ".product__arrow_prev",
      },
      modules: [Navigation, Thumbs],
      thumbs: {
        swiper: swiperThumbnails,
      },
    });
  })
}

const init = () => {
  const router = new Navigo('/', { linksSelector: 'a[href^="/"]' });
  const api = new ApiService();
  new Header().mount();
  new Main().mount();
  new Footer().mount();
  
  api.getProductCategories().then(data => {
    new Catalog().mount(new Main().element, data);
  })

  productSider();

  router.on('/', async () => {
    const products = await api.getProducts();
    new ProductList().mount(new Main().element, products);
    router.updatePageLinks();
  },
  {
    leave(done) {
      new ProductList().unmount();
      done();
    },
    already() {
      console.log('already');
    }
  })
  .on('/category', async ({ params: {slug} }) => {
    const products = await api.getProducts();
    new ProductList().mount(new Main().element, products.filter(item => item.category === slug), slug);
    router.updatePageLinks();
  }, {
    leave(done) {
      new ProductList().unmount();
      done();
    },
    already() {
      console.log('already');
    }
  })
  .on('/favorite', async () => {
    const products = await api.getProducts();
    new ProductList().mount(new Main().element, products, 'Избранное');
    router.updatePageLinks();
  }, {
    leave(done) {
      new ProductList().unmount();
      done();
    },
    already() {
      console.log('already');
    }
  })
  .on('/search', () => {
    console.log('search')
  })
  .on('/product/:id', (obj) => {
    console.log('obj: ', obj);
  })
  .on('/cart', () => {
    console.log('cart')
  })
  .on('/order', () => {
    new Order().mount();
    console.log('order')
  })
  .notFound(() => {
    new Main().element.innerHTML = `
      <h2>Страница не найдена!</h2>
      <p>Через 5 секунд вы будете перенаправлены на <a href="/">главную страницу</a>.</p>
    `;

    setTimeout(() => {
      router.navigate('/');
    }, 5000)
  },
  {
    leave(done) {
      new Main().element.textContent = '';
      done();
    }
  })

  router.resolve();
}

init();
