"use strict";

/**
 * `page-populate-middleware` middleware
 * Strapi 5: dynamic zones are populated per-component with the `on` syntax.
 */

const media = {
  fields: ["url", "alternativeText", "caption", "width", "height"],
};

const populate = {
  contentSections: {
    on: {
      "sections.hero": {
        populate: { picture: media, buttons: "*" }
      },
      "sections.slider": {
        populate: { files: media }
      },
      "sections.heading": {
        populate: "*"
      },
      "sections.banners": {
        populate: {
          banner: {
            populate: { picture: media }
          }
        }
      },
      "sections.featured-products": {
        populate: {
          products: {
            populate: { cover: media }
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
          video: media,
          poster: media
        }
      },
    }
  },
  seo: {
    fields: ["metaTitle", "metaDescription"],
    populate: { shareImage: media }
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
