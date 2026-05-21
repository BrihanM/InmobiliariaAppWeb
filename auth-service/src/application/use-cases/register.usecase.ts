import { RegisterDTO } from "../dto/register.dto";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IRoleRepository } from "../../domain/repositories/role.repository";
import { IHashProvider } from "../ports/hash-provider.port";
import { AppError } from "../../domain/exceptions/app-error";
import { User } from "../../domain/entities/user.entity";
import { randomUUID } from "crypto";

export class RegisterUseCase {
  constructor(
    private userRepo: IUserRepository,
    private roleRepo: IRoleRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(dto: RegisterDTO): Promise<User> {
    /**
     * Flujo de registro:
     * 1. Verificar si el email ya existe.
     * 2. Hashear la contraseña.
     * 3. Crear la entidad `User` y persistirla mediante el repositorio.
     * 4. (Opcional) Asignar role por defecto.
     */
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new AppError("Email already registered", 409);

    const passwordHash = await this.hashProvider.hash(dto.password);

    const user = await this.userRepo.create(
      new User({
        id: randomUUID(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone ?? null,
        passwordHash
      }) as any
    );

    // Assign default role CLIENT
    const role = await this.roleRepo.findByName("CLIENT");
    if (role) {
      await this.userRepo.assignRole(user.id, role.id);
      user.role = role.name;
    }

    return user;
  }
}
