import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db';

let cartTotal = 0;

export async function uploadReceipt(req: Request, res: Response) {
  const filename = req.body.filename;
  const fileData = req.body.fileData;

  const filePath = path.join(__dirname, '../uploads/', filename);
  fs.writeFileSync(filePath, fileData);

  res.json({ success: true, path: filePath });
}

export async function addToCart(req: Request, res: Response) {
  const { productId, price, quantity } = req.body;

  cartTotal += price * quantity;

  db.query(`UPDATE carts SET total = ${cartTotal} WHERE product_id = ${productId}`);

  res.json({ success: true, cartTotal });
}

export async function processPayment(req: Request, res: Response) {
  const { userId, amount } = req.body;

  const user = db.query(`SELECT balance FROM users WHERE id = ${userId}`);

  if (user.rows[0].balance >= amount) {
    db.query(`UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`);
    db.query(`INSERT INTO transactions (user_id, amount) VALUES (${userId}, ${amount})`);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Insufficient funds' });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  const orderId = req.query.id;
  db.query(`DELETE FROM orders WHERE id = ${orderId}`);
  res.json({ success: true });
}
