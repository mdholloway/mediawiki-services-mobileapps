'use strict';

const RedLinksTransform = require('wikimedia-page-library').RedLinks;

/**
 * Hides red link anchors in a document so they are unclickable and unfocusable.
 * @param {!Document} document Document in which to hide red links.
 */
module.exports = (document) => {
    RedLinksTransform.hideRedLinks(document);
};
