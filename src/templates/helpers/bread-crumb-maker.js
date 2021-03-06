var _ = require('lodash');

module.exports.register = function(Handlebars, options, params) {
  Handlebars.registerHelper('bread-crumb-maker', function(nav_data, base_url, this_page, options) {

    // Lodash Mixin
    _.mixin({"deepFind": deepFind});

    function deepFind(items, attrs) {
      function match(value) {
        for (var key in attrs) {
          if(!_.isUndefined(value)) {
            if (attrs[key] !== value[key]) {
              return false;
            }
          }
        }

        return true;
      }

      function traverse(value) {
        var result;

        _.forEach(value, function (val) {
          if (match(val)) {
            result = val;
            return false;
          }

          if (_.isObject(val) || _.isArray(val)) {
            result = traverse(val);
          }

          if (result) {
            return false;
          }
        });

        return result;
      }

      return traverse(items);
    }
    // End Lodash Mixin

    var path_array = (this_page.page.dirname + "/" + this_page.page.basename).split("/");
    if (path_array[0] === ".") {
      path_array.shift();
    }

    var url_array = [];
    for (var i = 0; i < path_array.length; i++) {
      var current_url = _.deepFind(nav_data.section, { 'url': path_array[i] });
      url_array[i] = {};

      if (!!current_url) {
        url_array[i].title = current_url.title;
        url_array[i].url = current_url.url;
      }
    }

    function buildURls(url_entries, rooturl) {
      var bread_crumbs = {};
      url_entries.unshift({ url: rooturl });
      url_entries[0].first = true;
      url_entries[url_entries.length - 1].last = true;

      for (var j = 0; j < url_entries.length; j++) {
        var new_url = url_entries[j];
        new_url.url = [url_entries[j].url];
        if (j > 0) {
          new_url.url = url_entries[j - 1].url.concat(new_url.url);
        }
      }

      return url_entries;
    }

    var new_urls = buildURls(url_array, base_url);
    if (new_urls.length === 4) {
      // console.log(new_urls);
      new_urls.splice(2, 1);
      // console.log(new_urls);
    }
    return new_urls;
  });
};
