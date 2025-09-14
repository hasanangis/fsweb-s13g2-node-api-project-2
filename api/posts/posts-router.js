// posts için gerekli routerları buraya yazın
  const express = require('express');

  const postsModel = require('./posts-model');
    const router = express.Router();

  // tüm postları getirme                                   
    router.get('/', async (req, res, next) => {
      try {
        const allPost = await postsModel.find();
        res.json(allPost);
      } catch (error) {
        res.status(500).json({ message: 'Gönderiler alınamadı' });
      }
    });

    router.get('/:id', async (req, res, next) => {
      try {
        const post = await postsModel.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
        res.json(post);
      } catch (error) {
        res.status(500).json({ message: 'Gönderi bilgisi alınamadı' });
      }
    });

    router.post('/', async (req, res, next) => {
      try {
        const {title, contents} = req.body || {};
        if (!title || !contents) {
          return res.status(400).json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
        }

        const {id} = await postsModel.insert({title, contents});
        const postt = await postsModel.findById(id);
        res.status(201).json(postt);
      } catch (error) {
        res.status(500).json({ message: 'Veritabanınıza kaydedilirken bir hata oluştu' });
      }
    });

    router.put('/:id', async (req, res, next) => {
      try {
        const {title, contents} = req.body || {};
        const exist = await postsModel.findById(req.params.id);
        if (!exist) {   
          return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
        if (!title || !contents) {
          return res.status(400).json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
        }

        await postsModel.update(req.params.id, {title, contents});
        const updatedPost = await postsModel.findById(req.params.id);
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: 'Gönderi bilgileri güncellenemedi' });
      }
    });

    router.delete('/:id', async (req, res, next) => {
      try {
        const finded = await postsModel.findById(req.params.id);
        if (!finded) {
          return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }

        await postsModel.remove(req.params.id);
        res.status(200).json(finded);
      } catch (error) {
        res.status(500).json({ message: 'Gönderi silinemedi' });
      }
    });

    router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postsModel.findById(id);
    if (!post) {
      return res.status(404).json({
        message: "Girilen ID'li gönderi bulunamadı.",
      });
    }

    // Post varsa comments’leri getir
    const comments = await postsModel.findPostComments(id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Yorumlar bilgisi getirilemedi",
    });
  }
});
  module.exports = router;