const { Router } = require('express');
const { listAll, getById, create, update, remove } = require('../controllers/serviceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', listAll);
router.get('/:id', getById);
// Admin-only in production — auth guard is a placeholder here
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;