const cheerio = require('cheerio'),
      axios = require('axios'),
      db = require("../models");

module.exports = {
    scrape: (req, res) => {
        axios.get('https://tucsonfoodie.com/feed/')
        .then(response => {
            let $ = cheerio.load(response.data, { xmlMode: true });
            $('item').each((i, element) => {
                summaryData = $(element).children('description').text();
                cleanSummary = $(summaryData).first('p').text();
                cleanSummary = cleanSummary.replace(/ \[…\]/, '…');
                articleData = {
                    url: $(element).children('link').text(),
                    headline: $(element).children('title').text(),
                    summary: cleanSummary
                };
                db.Article.create(articleData)
                .then(newArticle => console.log(`NEW ARTICLE CREATED: ${newArticle.headline}\n`))
                .catch(err => console.log(`ERROR: ${err.errmsg}\n`));
            });
            res.redirect('/');
        })
        .catch(err => console.log(err));
    },

    getArticles: (req, res) => {
        db.Article.find({})
        .then(data => {
            res.render('index', {articles: data});
        })
        .catch(err => console.log(err));
    }
}