import { Router } from 'express';
import DatabaseService from '../services/DatabaseService.js';
import DataParser from '../helpers/DataParser.js';
import getUserId from '../helpers/getUserId.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let categoriesProducts = await DatabaseService.products.getProducts(8);
  let offersProducts = await DatabaseService.products.getProducts(12);
  let feedbacks = await DatabaseService.feedbacks.getFeedbacks();
  let blogArticles = await DatabaseService.blogArticles.getBlogArticles(2);

  offersProducts = offersProducts.slice(8, 12);

  categoriesProducts = categoriesProducts.map((product) =>
    DataParser.prepareProduct(product)
  );
  offersProducts = offersProducts.map((product) =>
    DataParser.prepareProduct(product)
  );
  feedbacks = feedbacks.map((feedback) => DataParser.prepareFeedback(feedback));
  blogArticles = blogArticles.map((article) =>
    DataParser.prepareBlogArticle(article)
  );

  res.render('index', {
    title: 'Organic',
    mainStyles: '/css/index.min.css',
    additionalStyles: [
      'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/tiny-slider.css'
    ],
    scriptApp: '/js/indexApp.js',
    categoriesProducts,
    offersProducts,
    feedbacks,
    blogArticles,
    cartPrice
  });
});

router.post('/search', async (req, res) => {
  let keywords = req.body.keywords;
  keywords = keywords.split(' ').join('-');
  res.redirect(`/search/${keywords}`);
});

router.get('/search', async (req, res) => {
  res.redirect('/shop');
  return;
});

router.get('/search/:keywords', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  const keywords = req.params.keywords.split('-');
  let foundProducts = await DatabaseService.products.searchProducts(keywords);

  foundProducts = foundProducts.map((product) =>
    DataParser.prepareProduct(product)
  );

  res.render('search-results', {
    title: `Search: ${keywords}`,
    mainStyles: '/css/shop.min.css',
    scriptApp: '/js/shopApp.js',
    foundProducts,
    cartPrice
  });
});

router.get('/cart', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  const cart = await DatabaseService.carts.getCart(userId);
  const products = [];
  for (const productId in cart.filling) {
    const product = await DatabaseService.products.getProduct(productId);
    products.push({
      ...DataParser.prepareProduct(product),
      count: cart.filling[productId]
    });
  }

  res.render('cart', {
    title: 'Cart',
    mainStyles: '/css/cart.min.css',
    scriptApp: '/js/cartApp.js',
    cartPrice,
    products,
    orderPlaced: req.query.orderPlaced
  });
});

router.post('/cart', async (req, res) => {
  const userId = getUserId(req);
  await DatabaseService.orders.placeOrder(userId);
  res.redirect('/cart?orderPlaced=true');
});

router.get('/cart/:id', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  const cart = await DatabaseService.carts.getCart(userId);
  let product = await DatabaseService.products.getProduct(req.params.id);
  if (product === null) {
    res.redirect('/404');
    return;
  }

  product = DataParser.prepareProduct(product);
  product = {
    ...product,
    count: cart.filling[product._id]
  };

  res.render('edit-product', {
    title: 'Cart',
    mainStyles: '/css/shop-single.min.css',
    scriptApp: '/js/shopSingleApp.js',
    cartPrice,
    product
  });
});

router.post('/cart/:id', async (req, res) => {
  const userId = getUserId(req);

  await DatabaseService.carts.changeProductQuantity(
    userId,
    req.params.id,
    Number.parseInt(req.body.quantity)
  );

  res.redirect('/cart');
});

router.get('/about', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let teammates = await DatabaseService.teammates.getTeammates(3);
  teammates = teammates.map((teammate) => DataParser.prepareTeammate(teammate));

  res.render('about', {
    title: 'About Us',
    mainStyles: '/css/about.min.css',
    scriptApp: '/js/aboutApp.js',
    teammates,
    cartPrice
  });
});

router.get('/shop', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let products = await DatabaseService.products.getProducts();
  products = products.map((product) => DataParser.prepareProduct(product));

  res.render('shop', {
    title: 'Shop',
    mainStyles: '/css/shop.min.css',
    scriptApp: '/js/shopApp.js',
    products,
    cartPrice
  });
});

router.get('/shop/:id', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let product = await DatabaseService.products.getProduct(req.params.id);
  if (product === null) {
    res.redirect('/404');
    return;
  }

  product = DataParser.prepareProduct(product);

  let relatedProducts = await DatabaseService.products.getRelatedProducts(
    product,
    4
  );
  relatedProducts = relatedProducts.map((product) =>
    DataParser.prepareProduct(product)
  );

  res.render('product', {
    title: product.title,
    mainStyles: '/css/shop-single.min.css',
    scriptApp: '/js/shopSingleApp.js',
    product,
    relatedProducts,
    cartPrice,
    productAdded: req.query.productAdded
  });
});

router.post('/shop/:id', async (req, res) => {
  const userId = getUserId(req);

  const productId = req.params.id;
  const quantity = Number.parseInt(req.body.quantity);

  await DatabaseService.carts.addToCart(userId, productId, quantity);

  res.redirect(`/shop/${productId}?productAdded=true`);
});

router.get('/service', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  res.render('service', {
    title: 'Services',
    mainStyles: '/css/service.min.css',
    scriptApp: '/js/serviceApp.js',
    cartPrice
  });
});

router.get('/service/detailed', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  res.render('service-detailed', {
    title: 'Quality Standard',
    mainStyles: '/css/service-single.min.css',
    scriptApp: '/js/serviceSingleApp.js',
    cartPrice
  });
});

router.get('/projects', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let farms = await DatabaseService.farms.getFarms();
  farms = farms.map((farm) => DataParser.prepareFarm(farm));

  res.render('projects', {
    title: 'Projects',
    mainStyles: '/css/portfolio.min.css',
    scriptApp: '/js/portfolioApp.js',
    farms,
    cartPrice
  });
});

router.get('/projects/:id', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let farm = await DatabaseService.farms.getFarm(req.params.id);
  if (farm === null) {
    res.redirect('/404');
    return;
  }

  farm = DataParser.prepareFarm(farm, true);

  res.render('farm', {
    title: farm.name,
    mainStyles: '/css/portfolio-single.min.css',
    scriptApp: '/js/portfolioSingleApp.js',
    farm,
    cartPrice
  });
});

router.get('/team', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let teammates = await DatabaseService.teammates.getTeammates();
  teammates = teammates.map((teammate) => DataParser.prepareTeammate(teammate));

  res.render('team', {
    title: 'Our Team',
    mainStyles: '/css/team.min.css',
    scriptApp: '/js/teamApp.js',
    teammates,
    cartPrice
  });
});

router.get('/blog', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let articles = await DatabaseService.blogArticles.getBlogArticles(6);
  articles = articles.map((article) => DataParser.prepareBlogArticle(article));

  res.render('blog', {
    title: 'Recent News',
    mainStyles: '/css/blog.min.css',
    scriptApp: '/js/blogApp.js',
    articles,
    cartPrice
  });
});

router.get('/blog/:id', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  let article = await DatabaseService.blogArticles.getBlogArticle(
    req.params.id
  );
  if (article === null) {
    res.redirect('/404');
    return;
  }

  article = DataParser.prepareBlogArticle(article, true);

  res.render('article', {
    title: article.title,
    mainStyles: '/css/blog-single.min.css',
    scriptApp: '/js/blogSingleApp.js',
    article,
    cartPrice
  });
});

router.get('/contact', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  res.render('contact', {
    title: 'Contact Us',
    mainStyles: '/css/contact.min.css',
    scriptApp: '/js/contactApp.js',
    cartPrice,
    messageSent: req.query.messageSent
  });
});

router.post('/contact', async (req, res) => {
  await DatabaseService.messages.sendMessage(req);
  res.redirect('/contact?messageSent=true');
});

router.post('/subscribe', async (req, res) => {
  const email = req.body.email;
  await DatabaseService.subscribers.addSubscriber(email);

  res.redirect(`back`);
});

router.get('*', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  res.status(404).render('404', {
    title: '404 Not Found',
    mainStyles: '/css/404.min.css',
    scriptApp: '/js/404App.js',
    cartPrice
  });
});

router.get('/404', async (req, res) => {
  const userId = getUserId(req);
  const cartPrice = await DatabaseService.carts.getCartPrice(userId);

  res.status(404).render('404', {
    title: '404 Not Found',
    mainStyles: '/css/404.min.css',
    scriptApp: '/js/404App.js',
    cartPrice
  });
});

export default router;
