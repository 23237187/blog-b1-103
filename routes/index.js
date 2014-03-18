
/*
 * GET home page.
 */
//var User = require('../DO/user');


var regFlash = true;
var rootFlash = true;
var loginFlash = true;


module.exports = function(app) {
    app.get('/', function(req, res){
        /*console.log(res.locals.user + '访问首页  ' + ": " + req.session.success);*/
        /*if (rootFlash == true){
            req.session.success = null;
            req.session.error = null;
            res.locals.success = null;
            res.locals.error = null;

        }*/
        var posts = poet.helpers.getPosts(0,5);
        var normal_posts_cats = poet.helpers.getCategories();
        console.log(posts);
        res.render('index',{
            posts: posts,
            normal_posts_cats: normal_posts_cats,
        });
        /*rootFlash = true;*/
    });

}