import { Request, Response } from 'express';
import { db } from '../db';

export async function updateUserRole(req: Request, res: Response) {
  const { userId, role } = req.body;

  db.query(`UPDATE users SET role = '${role}' WHERE id = ${userId}`);

  res.json({ success: true });
}

export async function updateUserProfile(req: Request, res: Response) {
  const userId = req.params.userId;
  const updates = req.body;

  const fields = Object.keys(updates)
    .map(key => `${key} = '${updates[key]}'`)
    .join(', ');

  db.query(`UPDATE users SET ${fields} WHERE id = ${userId}`);

  res.json({ success: true, updated: updates });
}

export async function getAllUsers(req: Request, res: Response) {
  const users = await db.query('SELECT * FROM users');
  res.json(users.rows);
}

export async function resetPassword(req: Request, res: Response) {
  const { userId, newPassword } = req.body;

  db.query(`UPDATE users SET password = '${newPassword}' WHERE id = ${userId}`);

  res.json({ success: true, message: `Password reset for user ${userId}` });
}
