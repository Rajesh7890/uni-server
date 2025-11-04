const Article = require("../models/article");

const ArticleController = {
  getAllArticles(req, res){
    Article.getAll().then(function(articles){
      res.json({ success: true, message: 'All articles', data: articles });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error getting articles', error: err });
    });
  },

  getArticleById(req, res){
    const id = req.params.id;

    Article.get(id).then(function(article){
      if (!article){
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      res.json({ success: true, message: 'Article found', data: article });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error getting article', error: err });
    });
  },

  getArticlesBySection(req, res){
    const section = req.params.section;

    Article.getBySection(section).then(function(articles){
      res.json({ success: true, message: `Articles from ${section} section`, data: articles });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error getting articles by section', error: err });
    });
  },

  getArticlesByTag(req, res){
    const tag = req.params.tag;

    Article.getByTag(tag).then(function(articles){
      res.json({ success: true, message: `Articles with ${tag} tag`, data: articles });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error getting articles by tag', error: err });
    });
  },

  createArticle(req, res){
    const article = req.body;

    Article.create(article).then(function(data){
      res.status(201).json({ success: true, message: 'Article created', data });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error creating article', error: err });
    });
  },

  updateArticle(req, res){
    const id = req.params.id;
    const article = req.body;

    Article.update({ ...article, id }).then(function(data){
      if (!data){
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      res.json({ success: true, message: 'Article updated', data });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error updating article', error: err });
    });
  },

  deleteArticle(req, res){
    const id = req.params.id;

    Article.delete(id).then(function(response){
      if (!response){
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      res.json({ success: true, message: 'Article deleted' });
    }).catch(function(err){
      res.status(500).json({ success: false, message: 'Error deleting article', error: err });
    });
  }
};

module.exports = ArticleController;
