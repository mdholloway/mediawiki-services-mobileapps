'use strict';

const sanitizeHtml = require('sanitize-html');

const ANY_REGEX = /^.{1,200}$/; // but not over 200 characters
const DECIMAL_REGEX = /^-?\d*\.?\d+$/;
const CSS_SIZE_REGEX = /^-?\d*\.?\d+(%|pc|pt|px|rem|em|ex|ch|vh|vw|vmin|vmax|mm|cm|in|lin)$/;
const SINGLE_STRING_REGEX = /^[a-zA-Z_0-9-]{1,200}$/; // words + dashes but no spaces
const HEX_REGEX = /^#(0x)?[0-9a-fA-F]{3,8}$/;
const RGB_REGEX = /^rgba?\([a-zA-Z_0-9,./% -]{6,200}\)$/;
const HSL_REGEX = /^hsla?\([a-zA-Z_0-9,./% -]{6,200}\)$/;

const SANITIZE_RULES = {
    // no 'a' tags allowed since we transform them to 'span' tags
    allowedTags: [ 'abbr', 'address', 'audio',
        'b', 'bdi', 'bdo', 'blockquote', 'br',
        'caption', 'cite', 'code', 'col', 'colgroup',
        'data', 'dd', 'del', 'dfn', 'dl', 'dt', 'div', 'em',
        'figcaption', 'figure', 'figure-inline',
        'hr', 'i', 'img', 'ins', 'kbd', 'li',
        'map', 'mark', 'ol', 'p', 'pre', 'picture', 'q',
        's', 'samp', 'small', 'span', 'source', 'strike', 'strong', 'sub', 'sup',
        'table', 'tbody', 'td', 'tfoot', 'thead', 'time', 'tr', 'track',
        'u', 'ul',
        'var', 'video', 'wbr' ],
    nonTextTags: [ 'style', 'script', 'textarea', 'embed', 'object', 'noscript' ],
    allowedAttributes: {
        '*': [ 'align', 'alt', 'aria-*', 'bgcolor', 'center', 'class', 'dir',
            'height', 'hidden', 'lang', 'style', 'title', 'translate', 'width' ],
        'audio': [ 'buffered', 'controls', 'loop' ],
        'blockquote': [ 'cite' ],
        'data': [ 'value' ],
        'img': [ 'decoding', 'ismap', 'longdesc', 'sizes', 'src', 'srcset', 'usemap' ],
        'ol': [ 'reversed', 'start', 'type' ],
        'q': [ 'cite' ],
        'source': [ 'sizes', 'src', 'srcset', 'type', 'media' ],
        'time': [ 'datetime' ],
        'track': [ 'default', 'kind', 'label', 'src', 'srclang' ],
        'video': [ 'buffered', 'controls', 'loop', 'poster', 'playsinline' ]
    },
    allowedStyles: {
        '*': {
            'background': [ HEX_REGEX, RGB_REGEX, HSL_REGEX, SINGLE_STRING_REGEX ],
            'border': [ ANY_REGEX ],
            'color': [ HEX_REGEX, RGB_REGEX, HSL_REGEX, SINGLE_STRING_REGEX ],
            'display': [ SINGLE_STRING_REGEX ],
            'font': [ ANY_REGEX ],
            'font-family': [ ANY_REGEX ],
            'font-size': [ CSS_SIZE_REGEX ],
            'font-style': [ /^normal$/, /^italic$/, /^oblique$/ ],
            'font-weight': [ /^bold$/,  /^bolder$/, /^lighter$/, /^normal$/, /^oblique$/,
                /^\d{3}$/ ],
            'height': [ CSS_SIZE_REGEX ],
            'letter-spacing': [ CSS_SIZE_REGEX ],
            'line-height': [ DECIMAL_REGEX ],
            'text-align': [ /^left$/, /^right$/, /^center$/, /^justify$/ ],
            'text-decoration': [ ANY_REGEX ],
            'text-transform': [ /^capitalize$/, /^uppercase$/, /^lowercase$/, /^none$/,
                /^full-width$/, /^inherit$/, /^initial$/, /^unset$/ ],
            'vertical-align': [ CSS_SIZE_REGEX ],
            'width': [ CSS_SIZE_REGEX ],
            'word-spacing': [ CSS_SIZE_REGEX ]
        }
    },
    allowedSchemes: [ 'data', 'http' , 'https' ]
};

/**
 * Parses the input HTML string and applies transformations to make
 * the resulting HTML string safer to consume.
 * @param {string} html input HTML
 * @return {string} sanitized HTML
 */
function sanitize(html) {
    return sanitizeHtml(html, SANITIZE_RULES);
}

module.exports = {
    sanitize,
    testing: {
        ANY_REGEX,
        DECIMAL_REGEX,
        CSS_SIZE_REGEX,
        SINGLE_STRING_REGEX,
        HEX_REGEX,
        RGB_REGEX,
        HSL_REGEX
    }
};