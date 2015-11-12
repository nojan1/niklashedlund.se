'use strict';
var path = require('path');
var modRewrite = require('connect-modrewrite');

// Default settings
module.exports.uglifyJs = process.env.UGLIFYJS || true; // to remove .min sufix edit template manually
module.exports.minifyCss = process.env.MINIFYCSS || true; // to remove .min sufix edit template manually
module.exports.cacheBust = process.env.CACHEBUST || true;
module.exports.optimizeImages = process.env.OPTIMIZEIMAGES || true;
module.exports.lintJs = process.env.LINTJS || true;

// Default paths
var app = 'app';
var tmp = '.tmp';
var dist = 'dist';
var bowerDir = 'bower_components';

// Default paths in app folder
var data = 'data';
var fonts = 'fonts';
var icons = 'icons';
var images = 'images';
var scripts = 'scripts';
var styles = 'styles';
var views = 'views';

// Rewrite rules enables removing .html extensions in development.
// This are possible routes for same test.html file:
// http://localhost:3000/test.html
// http://localhost:3000/test
var rewriteRules = [
  '^/$ - [L]', // default site root handling (index.html)
  '.html$ - [L]', // ignore routes ends with '.html'
  '(.*)/$ $1/index.html [L]', // routes with trailing slash are directories -> rewrite to directory index.html
  '\\/\[a-zA-Z0-9_\\-\@.]+\\.\[a-zA-Z0-9]+$ - [L]', // ignore files with extension (eg. .css, .js, ...)
  '(.*)$ $1.html [L]' // redirect routes ends with string without trailing slash to original html
];

// Browser sync task config
module.exports.browserSync = {
  dev: {
    server: {
      baseDir: [tmp, app],
      routes: {
        '/bower_components': bowerDir
      }
    },
    notify: false,
    debugInfo: false,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  },
  dist: {
    server: {
      baseDir: dist
    },
    notify: false,
    debugInfo: false,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  }
};

// Build size task config
module.exports.buildSize = {
  srcAll: dist + '/**/*',
  cfgAll: {
    title: 'build', 
    gzip: true
  },
  srcCss: path.join(dist, styles, '/**/*'),
  cfgCss: {
    title: 'CSS', 
    gzip: true
  },
  srcJs: path.join(dist, scripts, '/**/*'),
  cfgJs: {
    title: 'JS', 
    gzip: true
  },
  srcImages: path.join(dist, images, '/**/*'),
  cfgImages: {
    title: 'Images', 
    gzip: false
  }
};

// Clean task config
// Be carefull what you cleaning!
module.exports.clean = [tmp, dist];

// Copy fonts task config
module.exports.copyFonts = {
  src: [
    path.join(app, fonts, '**/*'), 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'
  ],
  dest: dist + '/fonts'
};

// Copy fonts task config
module.exports.copyIcons = {
  src: path.join(app, icons, '**/*'),
  dest: dist + '/icons'
};

// Copy extras task config
module.exports.copyExtras = {
  src: [
    app + '/*.*',
    '!' + app + '/*.html'
  ],
  dest: dist,
  cfg: {
    dot: true
  }
};

// Deploy task config
// FTP settings are in .env file
module.exports.deploy = {
  src: dist + '/**',
  dev: {
    root: dist,
    hostname: process.env.FTP_DEV_HOSTNAME,
    username: process.env.FTP_DEV_USER,
    destination: process.env.FTP_DEV_DEST
  },
  dist: {
    root: dist,
    hostname: process.env.FTP_DIST_HOSTNAME,
    username: process.env.FTP_DIST_USER,
    destination: process.env.FTP_DIST_DEST
  }
};

// Images task config
module.exports.images = {
  src: path.join(app, images, '**/*.{gif,png,jpg}'),
  srcSVG: path.join(app, images, '**/*.svg'),
  dest: dist + '/images',
  cfg: {
    progressive: true,
    interlaced: true,
    svgoPlugins: [{cleanupIDs: false}]
  }
};

// JSHint task config
module.exports.eslint = {
  src: [
    path.join(app, scripts,'**/*.js'), 
    path.join('!' + app, scripts,'plugins/**/*.js') // do not lint external plugins
  ]
};

// User scripts task
module.exports.scripts = {
  src: path.join(app, scripts, '**/*.js'),
  dest: path.join(tmp, scripts)
};

// Styles task config
module.exports.styles = {
  src: path.join(app, styles, '*.scss'),
  dest: path.join(tmp,styles),
  sassCfg: {}, 
  autoprefixerCfg: {browsers: ['last 2 version']}
};

// Templates task config
module.exports.templates = {
  
  src: path.join(app, views, '*.nunjucks'),
  srcBuild: path.join(tmp, 'nunjucks/*.nunjucks'),
  srcDir: path.join(app, views),
  srcBuildDir: tmp,
  dest: tmp,
  destBuild: path.join(dist),
  cfg: {
    pretty: true,
    compileDebug: true
  }
};

// TemplatesData task config
module.exports.templatesData = {
  src: path.join(app, views, data, '/**/*.json'),
  dest: app + '/views',
  dataName: 'data.json',
  dataPath: path.join(app, views, 'data.json')
};

module.exports.useref = {
  src: path.join(app, views, '/**/*.nunjucks'),
  dest: dist,
  destnunjucks: path.join(tmp, 'nunjucks'),
  assetsCfg: {
    searchPath : app
  },
  revManifestCfg: {merge: true}
};

// Watch task config
module.exports.watch = {
  styles: path.join(app, styles, '/**/*.scss'),
  nunjucks: [
    path.join(app, views, '/**/*.nunjucks'), 
    path.join(app, views, data, '/**/*.json')
  ],
  scripts: path.join(app, scripts, '/**/*.js'),
  wiredep: 'bower.json' 
};
	
// Wiredep task config
module.exports.wiredep = {
  sass: {
    src: path.join(app, styles, '/*.scss'),
    dest: path.join(app, styles),
    cfg: {
      ignorePath: '',
      overides: {}
    }
  },
  nunjucks: {
    src: path.join(app, views, '/*.nunjucks'),
    dest: path.join(app, views, '/'),
    cfg: {
      exclude: ['modernizr'],
      ignorePath: '../../',
      overides: {}
    }
  } 
}