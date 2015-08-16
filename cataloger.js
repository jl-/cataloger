;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Cataloger = factory();
  }
})(this, function() {
  /**
   * @typedef {CatalogNode}
   * @type {object}
   * @property {string} text Catalog item name
   * @property {array} subs Sub CatalogNodes
   * @property {string} level Catalog item level: `1`,`1-2-4`
   */

  /**
   * Helper Class to build a catalog-tree from the given [h1~h6]
   * @class
   * @param  {jQuery} $nodes A jQuery object contains [h1~h6], see example below
   * @example
   * ```js
   * var cataloger = new Cataloger($markdownContentWrapper.children());
   * var $catalog = cataloger.parse();
   * ```
   */
  function Cataloger($nodes) {
    this.catalog = parseCatalog($nodes);
    this.$catalog = null;
  }

  /**
   * Parse $node, generates the catalog info for `buildCatalogTree(catalog)`
   * @param  {jQuery} $nodes See `Cataloger($nodes)`
   * @return {CatalogNode} root CatalogNode
   */
  function parseCatalog($nodes) {
    /**
     * @param {jQuery} $el $h1...$h6
     * @param {Number} level 1~6
     * @intermal
     */
    function addCatalogNode(catalog, $el, level) {
      // @type CatalogNode
      var node = {};

      level = parseInt(level);
      while (-- level) catalog = catalog.subs[catalog.subs.length - 1] || catalog;

      level = catalog.subs.length + 1;
      node.text = $el.text();
      node.subs = [];
      node.level = catalog.level ? [catalog.level, level].join('-') : String(level);

      $el.attr('id', node.level);
      catalog.subs.push(node);
      return node;
    }

    var catalog = {};
    catalog.subs = [];
    $nodes.each(function() {
      if (/H(\d)/.test(this.tagName.toUpperCase())) {
        addCatalogNode(catalog, $(this), RegExp.$1);
      }
    });
    return catalog;
  }

  /**
   * Build a $catalog tree, breadth-first
   * @param  {object} catalog A tree-like json object parsed from $nodes
   * @return {jQuery} The root-node of catalog tree
   * @see `parseCatalog($node)`
   */
  function buildCatalogTree(catalog) {
    var $catalog = $('<ul>');
    var $parent = $catalog;
    var nodeStack = [];
    var node = catalog;
    var $node;
    var subIndex;

    while (node || nodeStack.length) {
      if (node) {
        for (subIndex = node.subs.length - 1; subIndex >= 0; subIndex--) {
          nodeStack.push({
            $parent: $parent,
            node: node.subs[subIndex]
          });
        }
        node = null;
      } else {
        node = nodeStack.pop();
        $parent = node.$parent;
        node = node.node;

        $node = $('<li>');
        $node.append($('<a>').text(node.text).attr('href', '#' + node.level));
        $parent.append($node);

        // $parent: sub CatalogNodes root
        if (node.subs.length) {
          $parent = $('<ul>');
          $node.append($parent);
        }
      }
    }
    return $catalog;
  }

  Cataloger.prototype.parse = function($nodes) {
    if ($nodes) {
      this.catalog = parseCatalog($nodes);
      this.$catalog = buildCatalogTree(this.catalog);
    }
    return this.$catalog || (this.$catalog = buildCatalogTree(this.catalog));
  }

  return Cataloger;
});
