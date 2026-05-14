import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const requestAdminClubSchema = z.object({
  club_id: z.number().int().positive(),
});

export const requestJoinClubSchema = z.object({
  club_id: z.number().int().positive(),
});

export const approveRequestSchema = z.object({
  request_id: z.number().int().positive(),
  action: z.enum(['approve', 'reject']),
});