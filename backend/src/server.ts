import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const port = 1337;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

app.post('/products', async (req: Request, res: Response) => {
  const { name, price } = req.body;

  if (!name.trim() || price === '') {
    return res.status(400).json({ error: 'Name and price cannot be empty' });
  }

  const result = await db.query(
    'INSERT INTO products (name, price, pending_changes) VALUES ($1, $2, $3) RETURNING *',
    [name, price, '{}']
  );
  res.status(201).json(result.rows[0]);
});

app.put('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // Define allowed fields rather than having hardcoded values
  // for each field that should be published
  const allowedFields = ['name', 'price'];

  const unexpectedFields = Object.keys(updates).filter(key => !allowedFields.includes(key));
  if (unexpectedFields.length > 0) {
    return res.status(400).json({ error: `Unexpected fields: ${unexpectedFields.join(', ')}` });
  }

  if (('name' in updates && !updates.name.trim()) || ('price' in updates && updates.price === '')) {
    return res.status(400).json({ error: 'Name and price cannot be empty' });
  }

  const result = await db.query(
    'UPDATE products SET pending_changes = pending_changes || $1::jsonb WHERE id = $2 RETURNING *',
    [JSON.stringify(updates), id]
  );
  res.json(result.rows[0]);
});

app.get('/products', async (req: Request, res: Response) => {
  const result = await db.query('SELECT id, name, price FROM products');
  res.json(result.rows);
});

app.get('/products/pending', async (req: Request, res: Response) => {
  const result = await db.query(
    `SELECT * FROM products
     WHERE EXISTS (
       SELECT 1 FROM jsonb_each_text(pending_changes) AS kv
       WHERE kv.value IS NOT NULL
     )`
  );
  res.json(result.rows);
});


app.post('/products/publish', async (req: Request, res: Response) => {
  const { ids } = req.body;
  const result = await db.query(
    `UPDATE products 
     SET name = COALESCE(pending_changes->>'name', name), 
         price = COALESCE((pending_changes->>'price')::numeric, price), 
         pending_changes = '{}'::jsonb 
     WHERE id = ANY($1::int[]) 
     RETURNING *`,
    [ids]
  );
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
