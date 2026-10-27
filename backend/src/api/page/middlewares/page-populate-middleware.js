"use strict";

/**
 * `page-populate-middleware` middleware
 * Strapi 5: dynamic zones are populated per-component with the `on` syntax.
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
      "sections.features": {
        populate: {
          feature: {
            populate: "*"
          }
        }
      },
      "sections.feature-columns-group": {
        populate: {
          features: {
            populate: "*"
          }
        }
      },
      "sections.feature-rows-group": {
        populate: {
          features: {
            populate: "*"
          }
        }
      },
      "sections.testimonials-group": {
        populate: {
          testimonials: {
            populate: "*"
          }
        }
      },
      "sections.pricing": {
        populate: {
          plans: {
            populate: "*"
          }
        }
      },
      "sections.lead-form": {
        populate: {
          submitButton: "*"
        }
      },
      "sections.bottom-actions": {
        populate: {
          buttons: "*"
        }
      },
      "sections.large-video": {
        populate: {
          video: "*",
          poster: "*"
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
      filters: ctx.query.filters ?? {},
      locale: ctx.query.locale,
    };

    await next();
  };
};
