import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('chat', { js: ['socket'] });
});

export default router;
