const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/articleController');

router.get('/', ArticleController.getAllArticles);

router.get('/:id', ArticleController.getArticleById);

router.get('/section/:section', ArticleController.getArticlesBySection);

router.get('/tag/:tag', ArticleController.getArticlesByTag);

router.post('/', ArticleController.createArticle);

router.put('/:id', ArticleController.updateArticle);

router.delete('/:id', ArticleController.deleteArticle);

module.exports = router;
