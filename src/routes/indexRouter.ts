import express, { Response } from 'express';
const router = express.Router();

router.get('/', (_, res: Response) => {
  res.render("index", { title: "HMP School Notes" });
})

export default router;
