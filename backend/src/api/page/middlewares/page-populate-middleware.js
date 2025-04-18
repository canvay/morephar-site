"use strict";

/**
 * `page-populate-middleware` middleware
 */

const populate = {
  contentSections: {
    on: {
      "sections.hero": {
        populate: "*"
      },
      "sections.slider": {
        populate: "*"
      },
      "sections.heading": {
        populate: "*"
      },
      "sections.banners": {
        populate: {
          banner: {
            populate: "*"
          }
        }
      },
      "sections.featured-products": {
        populate: {
          products: {
            populate: "*"
          }
        }
      },
    }
  },
  seo: {
    fields: ["metaTitle", "metaDescription"],
    populate: { shareImage: true }
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.js: ctx.query = ", ctx.query);

    await next();
  };
};
