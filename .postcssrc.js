// https://github.com/michael-ciniawsky/postcss-load-config
const path = require('path')

module.exports = {
  "plugins": {
    "postcss-import": {
      resolve: function(id, basedir, importOptions){
        if(id.match(/@/) && id.match(/@/).index === 0 ){
          return path.join(__dirname, 'src', id.substr(1))
        }
        return id;
      }
    },
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
