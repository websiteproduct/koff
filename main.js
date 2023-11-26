import 'normalize.css'
import './style.scss'
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { Footer } from './modules/Footer/Footer';
import { Order } from './modules/Order/Order';

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
  productSider();

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  const router = new Navigo('/', { linksSelector: 'a[href^="/"]' });

  router.on('/', () => {
    console.log('на главной');
  })
  .on('/category', () => {
    console.log('category')
  })
  .on('/favorite', () => {
    console.log('favorite')
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
    console.log(404)
  })

  router.resolve();
}

init();
