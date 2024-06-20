import Product from './models/Product.js';
import Feedback from './models/Feedback.js';
import BlogArticle from './models/BlogArticle.js';
import Farm from './models/Farm.js';
import Teammate from './models/Teammate.js';
import Message from './models/Message.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';
import Subscriber from './models/Subscriber.js';

const DatabaseService = {
  products: {
    getProducts: async (limit = null) => {
      return await Product.find({}).limit(limit).lean();
    },
    getProduct: async (id) => {
      let product;

      try {
        product = await Product.findOne({ _id: id }).lean();
        if (product === null) {
          throw ReferenceError("Product with such id doesn't exist!");
        }
      } catch (err) {
        console.log(err);
        return null;
      }

      return product;
    },
    getRelatedProducts: async (product, limit = null) => {
      return await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      })
        .limit(limit)
        .lean();
    },
    searchProducts: async (keywords) => {
      let foundProducts = [];

      for (const keyword of keywords) {
        const foundProductsByName = await Product.find({
          title: { $regex: keyword, $options: 'i' }
        }).lean();
        foundProducts = foundProducts.concat(foundProductsByName);

        const foundProductsByCategory = await Product.find({
          category: { $regex: keyword, $options: 'i' }
        }).lean();
        foundProducts = foundProducts.concat(foundProductsByCategory);
      }

      foundProducts = foundProducts.filter((product, index, self) => {
        return (
          index ===
          self.findIndex((prod) => {
            return prod._id.toString() === product._id.toString();
          })
        );
      });

      return foundProducts;
    }
  },

  feedbacks: {
    getFeedbacks: async (limit = 3) => {
      return await Feedback.find({}).limit(limit).lean();
    }
  },

  blogArticles: {
    getBlogArticles: async (limit = null) => {
      return await BlogArticle.find({}).limit(limit).lean();
    },
    getBlogArticle: async (id) => {
      let article;

      try {
        article = await BlogArticle.findOne({ _id: id }).lean();
        if (article === null) {
          throw ReferenceError("Article with such id doesn't exist!");
        }
      } catch (err) {
        console.log(err);
        return null;
      }

      return article;
    }
  },

  farms: {
    getFarms: async () => {
      return await Farm.find({}).lean();
    },
    getFarm: async (id) => {
      let farm;

      try {
        farm = await Farm.findOne({ _id: id }).lean();
        if (farm === null) {
          throw ReferenceError("Farm with such id doesn't exist!");
        }
      } catch (err) {
        console.log(err);
        return null;
      }

      return farm;
    }
  },

  teammates: {
    getTeammates: async (limit = null) => {
      return await Teammate.find({}).limit(limit).lean();
    }
  },

  messages: {
    sendMessage: async (req) => {
      const message = new Message({
        fullName: req.body.name,
        email: req.body.email,
        company: req.body.company,
        subject: req.body.subject,
        message: req.body.message
      });

      await message.save();
    }
  },

  carts: {
    getCart: async (userId) => {
      const doesCartExist = await Cart.exists({ userId });

      if (!doesCartExist) {
        const cart = new Cart({
          userId,
          filling: {}
        });

        await cart.save();
      }

      return await Cart.findOne({ userId }).lean();
    },
    addToCart: async (userId, productId, quantity) => {
      if (quantity === 0) {
        return;
      }

      const cart = await Cart.findOne({ userId }).lean();
      const filling = cart.filling ? cart.filling : {};

      filling[productId] = filling[productId]
        ? filling[productId] + quantity
        : quantity;

      await Cart.updateOne({ userId }, { filling });
    },
    getCartPrice: async (userId) => {
      let cart = await Cart.findOne({ userId }).lean();
      if (!cart) {
        cart = await DatabaseService.carts.getCart(userId);
      }

      let price = 0;
      if (cart.filling) {
        for (const productId in cart.filling) {
          price +=
            (await Product.findOne({ _id: productId }).lean()).price *
            cart.filling[productId];
        }
      }

      return price;
    },
    changeProductQuantity: async (userId, productId, quantity) => {
      const cart = await Cart.findOne({ userId }).lean();
      const filling = cart.filling;

      if (quantity !== 0) {
        filling[productId] = quantity;
      } else {
        delete filling[productId];
      }

      await Cart.updateOne({ userId }, { filling });
    }
  },

  orders: {
    placeOrder: async (userId) => {
      const cart = await Cart.findOne({ userId }).lean();

      const order = new Order({
        userId,
        filling: cart.filling,
        price: await DatabaseService.carts.getCartPrice(userId)
      });

      await order.save();
      await Cart.updateOne({ userId }, { filling: {} });
    }
  },

  subscribers: {
    addSubscriber: async (email) => {
      const doesSubscriberExist = await Subscriber.exists({ email: email });
      if (!doesSubscriberExist) {
        const subscriber = new Subscriber({ email: email });
        await subscriber.save();
      }
    }
  }
};

export default DatabaseService;
