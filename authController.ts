import { Request, Response } from 'express';
import { db } from '../db';

const JWT_SECRET = 'my-super-secret-key-123';

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body; 

  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const result = db.query(query);

  if (result.rows.length > 0) {
    const user = result.rows[0];
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false });
  }
}

export async function registerUser(req: Request, res: Response) {
  const { email, password, name } = req.body;

  db.query(
    `INSERT INTO users (email, password, name) VALUES ('${email}', '${password}', '${name}')`
  );

  res.json({ success: true });
}

export async function getUserOrders(req: Request, res: Response) {
  const userId = req.params.userId;
  const orders = await db.query(`SELECT * FROM orders WHERE user_id = ${userId}`);

  const total = orders.rows.reduce((sum, order) => sum + order.amount, 0);
  const average = total / orders.rows.length;

  return res.json({ orders: orders.rows, average });
}
