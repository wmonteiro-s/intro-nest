
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { mock } from "node:test";


// Mock do PrismaService
// Aqui estamos criando um mock do PrismaService para simular as operações de banco de dados
const mockPrisma = {
    user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}

// Testes para o UsersService
// Aqui estamos criando uma suite de testes para o UsersService, que é responsável por gerenciar usuários
// Usamos o Jest para criar mocks e verificar se as funções estão sendo chamadas corretamente
describe("UsersService", () => {
  let service: UserService;

  // Antes de cada teste, criamos uma instância do UsersService com o PrismaService mockado
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Testes individuais
  // Aqui definimos os testes individuais para cada funcionalidade do UsersService
  it("deve criar um usuário", async () => {
    const dto = { name: "Jonas", email: "jonas@example.com", password: "123" };
    mockPrisma.user.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);
    expect(result).toEqual(dto);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
  });

  it("deve listar todos os usuários", async () => {
    const dto = [
        { name: "Wesley", email: "wesley@gmail.com", password: "senha123"},
        { name: "Marcos", email: "marquin@gmail.com", password: "senha123"},
        { name: "Brendo", email: "brendo@gmail.com", password: "senha123"},
    ]
    mockPrisma.user.findMany.mockResolvedValue(dto)

    const result = await service.findAll()
    expect(result).toEqual(dto)
    expect(mockPrisma.user.findMany).toHaveBeenCalled()
  })

  it("deve mostrar um usuário específico", async () => {
    const dto = [
      { id: '1', name: "Wesley", email: "wesley@gmail.com", password: "senha123"},
      { id: '2', name: "Marcos", email: "marquin@gmail.com", password: "senha123"},
      { id: '3', name: "Brendo", email: "brendo@gmail.com", password: "senha123"},
  ]
  mockPrisma.user.findUnique.mockResolvedValue(dto)

  const result = await service.findOne(dto[1].id)

  expect(result).toEqual(dto)

  })

  it("deve atualizar um usuário específico", async () => {
    const dto = [
      { id: '1', name: "Wesley", email: "wesley@gmail.com", password: "senha123"},
      { id: '2', name: "Marcos", email: "marquin@gmail.com", password: "senha123"},
      { id: '3', name: "Brendo", email: "brendo@gmail.com", password: "senha123"},
    ]
    mockPrisma.user.findUnique.mockResolvedValue(dto)
    mockPrisma.user.update.mockResolvedValue(dto)

    const result = await service.update(dto[1].id, {
      name: 'Jeferson',
      email: 'jeferson@gmail.com',
      senha: 'senha123'
    } as any)

    expect(result).toEqual(dto)

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: {id: '2'},
      data: { name: 'Jeferson',
              email: 'jeferson@gmail.com',
              senha: 'senha123'
      }
    })
  })

  it('deve deletar um usuário específico', async () => {
    const dto = [
      { id: '1', name: "Wesley", email: "wesley@gmail.com", password: "senha123"},
      { id: '2', name: "Marcos", email: "marquin@gmail.com", password: "senha123"},
      { id: '3', name: "Brendo", email: "brendo@gmail.com", password: "senha123"},
    ]
  
    mockPrisma.user.findUnique.mockResolvedValue(dto[1])
    mockPrisma.user.delete.mockResolvedValue(dto[1])
  
    const result = await service.remove(dto[1].id)
  
    expect(result).toEqual(dto[1])
  
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: '2' }
    })
  })

});

// Executar os  testes: npm test