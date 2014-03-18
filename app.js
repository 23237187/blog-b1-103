var
    express = require( 'express' ),
    app = express(),
    Poet = require('poet');

var routes = require('./routes'),
    http = require('http'),
    path = require('path');


/*var MongoStore = require('connect-mongo')(express);
    config = require('./config/config.js');*/
var config = require('./config/config.js');

//国际化
var i18n = require('i18n');
i18n.configure({
    locales:['en-us', 'zh-cn'],
    defaultLocale: config.language,
    directory: './i18n',
    updateFiles: false,
    indent: "\t",
    extension: '.json'
});

//日志+配置
var log4js = require('log4js');
log4js.configure('./config/my_log4js_configuration.json',{});

var accessLog = log4js.getLogger('accessLog');
var logmailer = log4js.getLogger('mailer');

app.use(log4js.connectLogger(accessLog, {
    level:'info'
    //format:':method :url'
}));
app.use(log4js.connectLogger(logmailer, {
    level:'error',
    format:':method :url'
}));

exports.logger = function(name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};

/**
 * Instantiate and hook Poet into express; no defaults defined
 */
poet = Poet(app,{
    posts: './node_modules/poet/examples/_posts'
});


poet_team_introduction = Poet(app, {
    postsPerPage: 5,
    posts: './_team_introduction',
    metaFormat: 'json',
    routes: {
        '/aboutUs/ourposts/:post': 'post',//maping this route to ./view/post.jade
        '/aboutUs/pagination/:page': 'page',
        '/aboutUs/ourtags/:tag': 'tag',
        '/aboutUs/ourcategories/:category': 'category'
    }
});

/**
 * In this example, upon initialization, we can modify the posts,
 * like format the dates using a library, or modify titles.
 * We'll add some asterisks to the titles of all posts for fun.
 */
poet.init().then(function () {
    poet.clearCache();
    Object.keys(poet.posts).map(function (title) {
        var post = poet.posts[title];
        post.title = post.title;
    });
});

poet_team_introduction.init().then(function () {
    poet_team_introduction.clearCache();
    Object.keys(poet_team_introduction.posts).map(function (title) {
        var poet_team_introduction = poet_team_introduction.posts[title];
        poet_team_introduction.title = poet_team_introduction.title;
    });
});


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



/**
 * Now we set up custom routes; based on the route (ex: '/post/:post'),
 * it'll override the default route for the same type and update
 * all appropriate helper methods
 */

poet.addRoute('/mypost/:post', function (req, res) {
    var post = poet.helpers.getPost(req.params.post);
    var normal_posts_cats = poet.helpers.getCategories();
    if (post) {
        res.render('post', {
            post: post,
            normal_posts_cats: normal_posts_cats
        });
    } else {
        res.send(404);
    }
});

poet_team_introduction.addRoute('/aboutUs/ourpost/:post', function (req, res) {
    var post = poet_team_introduction.helpers.getPost(req.params.post);
    var normal_posts_cats = poet.helpers.getCategories();
    if (post) {
        res.render('post', {
            post: post,
            normal_posts_cats: normal_posts_cats
        });
    } else {
        res.send(404);
    }
});

poet.addRoute('/mytags/:tag', function (req, res) {
    var taggedPosts = poet.helpers.postsWithTag(req.params.tag);
    if (taggedPosts.length) {
        res.render('tag', {
            posts: taggedPosts,
            tag: req.params.tag
        });
    }
});

poet.addRoute('/mycategories/:category', function (req, res) {
    console.log(req.params.category);
    var categorizedPosts = poet.helpers.postsWithCategory(req.params.category);
    console.log(categorizedPosts);
    if (categorizedPosts.length) {
        res.render('category', {
            posts: categorizedPosts,
            category: req.params.category
        });
    }
});

poet.addRoute('/mypages/:page', function (req, res) {
    var page = req.params.page,
        lastPost = page * 3;
    res.render('page', {
        posts: poet.helpers.getPosts(lastPost - 3, lastPost),
        page: page
    });
});

poet_team_introduction.addRoute('/aboutUs/ourcategories/:category', function(req, res){

    console.log(req.params.category);
    var categorizedPosts = poet_team_introduction.helpers.postsWithCategory(req.params.category);
    var normal_posts_cats = poet.helpers.getCategories();
    console.log(categorizedPosts);
    if (categorizedPosts.length) {
        res.render('category', {
            posts: categorizedPosts,
            category: req.params.category,
            normal_posts_cats:normal_posts_cats
        });
    }
});



app.use(app.router);
routes(app);

console.error("hello world");
app.listen(3000);
