import path from 'path';

const monthsFullNames = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December'
};

export default class DataParser {
  static prepareProduct(product) {
    let oldPrice = product.oldPrice;
    let price = product.price;
    let imgName = product.imgName;

    const fixPrice = (price) => {
      return Number.isInteger(price) ? `${price}.00` : price.toString();
    };

    oldPrice = fixPrice(oldPrice);
    price = fixPrice(price);

    imgName = path.join('/db-images', 'products', imgName);
    return {
      ...product,
      oldPrice,
      price,
      imgName
    };
  }

  static prepareFeedback(feedback) {
    let avatarName = feedback.avatarName;

    avatarName = path.join('/db-images', 'client-avatars', avatarName);

    return {
      ...feedback,
      avatarName
    };
  }

  static prepareBlogArticle(article, makeFullMonthNames = false) {
    let promoImageNameMini = article.promoImageNameMini;
    promoImageNameMini = path.join(
      '/db-images',
      'blog-articles-promo-images',
      'minis',
      promoImageNameMini
    );

    let promoImageName = article.promoImageName;
    promoImageName = path.join(
      '/db-images',
      'blog-articles-promo-images',
      promoImageName
    );

    const date = article.date.toString();
    const tokens = date.split(' ');

    const day = tokens[2];
    let month = tokens[1];
    const year = tokens[3];

    if (makeFullMonthNames) {
      month = monthsFullNames[month];
    }

    return {
      ...article,
      promoImageNameMini,
      promoImageName,
      day,
      month,
      year
    };
  }

  static prepareFarm(farm, makeFullMonthNames = false) {
    let promoImageNameMini = farm.promoImageNameMini;
    promoImageNameMini = path.join(
      '/db-images',
      'farms-promo-images',
      'minis',
      promoImageNameMini
    );

    let promoImageName = farm.promoImageName;
    promoImageName = path.join(
      '/db-images',
      'farms-promo-images',
      promoImageName
    );

    const date = farm.date.toString();
    const tokens = date.split(' ');

    const day = tokens[2];
    let month = tokens[1];
    const year = tokens[3];

    if (makeFullMonthNames) {
      month = monthsFullNames[month];
    }

    return {
      ...farm,
      promoImageNameMini,
      promoImageName,
      day,
      month,
      year
    };
  }

  static prepareTeammate(teammate) {
    let photoName = teammate.photoName;
    photoName = path.join('/db-images', 'teammates-photos', photoName);

    return {
      ...teammate,
      photoName
    };
  }

  static prepareCart(cart) {
    if (!('filling' in cart)) {
      cart.filling = {};
    }

    return {
      ...cart
    };
  }
}
