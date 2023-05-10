import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('error', {
		bodyClass: 'error'
	});
});

export default router;
