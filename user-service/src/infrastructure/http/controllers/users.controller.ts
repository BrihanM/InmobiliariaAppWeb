import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.usecase';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.usecase';
import { GetUserUseCase } from '../../../application/use-cases/get-user.usecase';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.usecase';
import { PatchRolesUseCase } from '../../../application/use-cases/patch-roles.usecase';

export const makeUsersController = (deps: {
  list: ListUsersUseCase;
  get: GetUserUseCase;
  update: UpdateUserUseCase;
  delete: DeleteUserUseCase;
  patchRoles: PatchRolesUseCase;
}) => ({
  /**
   * Lista usuarios con paginación y filtros.
   * Los filtros disponibles: email, firstName, lastName, role.
   */
  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    const filters = { email: req.query.email as string | undefined, firstName: req.query.firstName as string | undefined, lastName: req.query.lastName as string | undefined, role: req.query.role as string | undefined };
    const result = await deps.list.execute(filters, page, pageSize);
    res.json(result);
  },

  /**
   * Obtiene un usuario por su `id`. Retorna 404 si no existe.
   */
  get: async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await deps.get.execute(id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  },

  /**
   * Actualiza los campos permitidos del usuario.
   */
  update: async (req: Request, res: Response) => {
    const id = req.params.id;
    const dto = req.body;
    const updated = await deps.update.execute(id, dto);
    res.json(updated);
  },

  /**
   * Eliminación lógica de un usuario (soft-delete).
   */
  delete: async (req: Request, res: Response) => {
    const id = req.params.id;
    await deps.delete.execute(id);
    res.status(204).send();
  },

  /**
   * Actualiza los roles asignados a un usuario.
   * Espera un array de `roleIds` en el body.
   */
  patchRoles: async (req: Request, res: Response) => {
    const id = req.params.id;
    const { roles } = req.body;
    await deps.patchRoles.execute(id, roles);
    res.status(204).send();
  }
});
