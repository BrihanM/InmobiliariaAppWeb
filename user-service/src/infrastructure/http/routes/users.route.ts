import { Router } from 'express';
import { PrismaUserRepository } from '../../database/repositories/prisma-user.repository';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.usecase';
import { GetUserUseCase } from '../../../application/use-cases/get-user.usecase';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.usecase';
import { PatchRolesUseCase } from '../../../application/use-cases/patch-roles.usecase';
import { makeUsersController } from '../controllers/users.controller';
import { updateUserSchema, patchRolesSchema } from '../schemas/user.schemas';
import { authMiddleware, rbac } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Rutas del `user-service`.
 * Instancia casos de uso y repositorios y aplica middlewares de autenticación y RBAC.
 */
const repo = new PrismaUserRepository();
const listUC = new ListUsersUseCase(repo);
const getUC = new GetUserUseCase(repo);
const updateUC = new UpdateUserUseCase(repo);
const deleteUC = new DeleteUserUseCase(repo);
const patchRolesUC = new PatchRolesUseCase(repo);

const controller = makeUsersController({ list: listUC, get: getUC, update: updateUC, delete: deleteUC, patchRoles: patchRolesUC });

router.get('/', authMiddleware, rbac(['ADMIN']), controller.list);
router.get('/:id', authMiddleware, rbac(['ADMIN','USER']), controller.get);
router.put('/:id', authMiddleware, rbac(['ADMIN']), (req,res,next)=>{ try{ const dto = updateUserSchema.parse(req.body); req.body = dto; return controller.update(req,res); }catch(e){ next(e); }});
router.delete('/:id', authMiddleware, rbac(['ADMIN']), controller.delete);
router.patch('/:id/roles', authMiddleware, rbac(['ADMIN']), (req,res,next)=>{ try{ const dto = patchRolesSchema.parse(req.body); req.body = dto; return controller.patchRoles(req,res); }catch(e){ next(e); }});

export const usersRouter = router;
