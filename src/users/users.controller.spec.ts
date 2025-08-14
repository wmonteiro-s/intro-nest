import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
}

describe('UsersController Tests', () => {
    
    let controller: UsersController

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {provide: UserService, useValue: mockUserService}
            ],
        }).compile()

        controller = module.get<UsersController>(UsersController)
    })

    it('deve listar todos os usuários', async () => {
        const users = [
            { name: 'Wesley', email: 'wesley@gmail.com'},
            { name: 'Marcos', email: 'marcos@gmail.com'},
            { name: 'Felipe', email: 'felipe@gmail.com'},
        ]
        mockUserService.findAll.mockResolvedValue(users)

        expect(await controller.findAll()).toEqual(users)
    })

    it('deve mostrar um usuário específico', async () => {
        const users = [
            { id: '1', name: 'Wesley', email: 'wesley@gmail.com'},
            { id: '2', name: 'Marcos', email: 'marcos@gmail.com'},
            { id: '3', name: 'Felipe', email: 'felipe@gmail.com'},
        ]
        mockUserService.findOne.mockResolvedValue(users[0])

        expect(await controller.findOne(users[0].id)).toEqual(users[0])
    })

    it('deve atualizar um usuário', async () => {
        const users = [
            { id: '1', name: 'Wesley', email: 'wesley@gmail.com'},
            { id: '2', name: 'Marcos', email: 'marcos@gmail.com'},
            { id: '3', name: 'Felipe', email: 'felipe@gmail.com'},
        ]

        const updatedUser = { name: 'Brendo', email: 'brendo@gmail.com'}

        mockUserService.update.mockResolvedValue(updatedUser)

        expect(await controller.update(users[2].id, updatedUser)).toEqual(updatedUser)
    })

    it('deve deletar um usuário específico', async () => {
        const users = [
            { id: '1', name: 'Wesley', email: 'wesley@gmail.com'},
            { id: '2', name: 'Marcos', email: 'marcos@gmail.com'},
            { id: '3', name: 'Felipe', email: 'felipe@gmail.com'},
        ]

        mockUserService.remove.mockResolvedValue(users[1])

        expect(await controller.remove(users[1].id)).toEqual(users[1])
    
    })
})