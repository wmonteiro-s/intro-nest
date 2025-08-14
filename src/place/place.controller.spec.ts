import { Test, TestingModule } from '@nestjs/testing'
import { PlaceController } from './place.controller'
import { PlaceService } from './place.service'
import { CloudinaryService } from './cloudinary.service'
import { Place, placeType } from '@prisma/client'

describe('PlaceController Tests', () => {
    let controller: PlaceController
    let placeService: jest.Mocked<PlaceService>
    let cloudinaryService: jest.Mocked<CloudinaryService>

    beforeEach(async () => {
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any

        const mockCloudinaryService = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
        } as any

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                { provide: PlaceService, useValue: mockPlaceService },
                { provide: CloudinaryService, useValue: mockCloudinaryService },
            ]
        }).compile()

        controller = module.get<PlaceController>(PlaceController)
        placeService = module.get(PlaceService)
        cloudinaryService = module.get(CloudinaryService)
    })

    it('deve listar todos os locais', async () => {
        const places: Place[] = [
            { id: '1', name: 'Hotel Genérico', type: placeType.HOTEL, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '2', name: 'Restaurante Genérico', type: placeType.RESTAURANTE, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '3', name: 'Bar Genérico', type: placeType.BAR, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
        ]
        placeService.findAll.mockResolvedValue(places)

        expect(await controller.findAll()).toEqual(places)
    })

    it('deve listar locais paginados', async () => {
        const places: Place[] = [
            { id: '1', name: 'Hotel Genérico', type: placeType.HOTEL, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '2', name: 'Restaurante Genérico', type: placeType.RESTAURANTE, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '3', name: 'Bar Genérico', type: placeType.BAR, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
        ]

        placeService.findPaginated.mockResolvedValue({
            data: places,
            meta: {
                total: places.length,
                page: 1,
                lastPage: 1,
            }
        })

        const result = await controller.findPaginated()
        expect(result.data).toEqual(places)
    })

    it('deve criar um local', async () => {
        const dto: Place = { id: '1', name: 'Hotel genérico', type: placeType.HOTEL, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() }

        placeService.create.mockResolvedValue(dto)

        const mockFiles = {
            images: [
                { original_name: 'imagem.jpg', buffer: Buffer.from('fake')}
            ]
        }

        expect(await controller.createPlace(dto, mockFiles)).toEqual(dto)
    })

    it('deve atualizar um local específico', async () => {
        const places: Place[] = [
            { id: '1', name: 'Hotel Genérico', type: placeType.HOTEL, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '2', name: 'Restaurante Genérico', type: placeType.RESTAURANTE, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '3', name: 'Bar Genérico', type: placeType.BAR, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
        ]

        const updatedPlace: Place = { id: '1', name: 'Hotel não genérico', type: placeType.HOTEL, phone: '(88) 00000-0000', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() }

        placeService.update.mockResolvedValue(updatedPlace)

        expect(await placeService.update(places[0].id, updatedPlace)).toEqual(updatedPlace)

    })

    it('deve excluir um local específico', async () => {
        const places: Place[] = [
            { id: '1', name: 'Hotel Genérico', type: placeType.HOTEL, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '2', name: 'Restaurante Genérico', type: placeType.RESTAURANTE, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
            { id: '3', name: 'Bar Genérico', type: placeType.BAR, phone: '(88) 99999-9999', latitude: -3.7327, longitude: 38.5267, images: [], created_at: new Date() },
        ]

        placeService.delete.mockResolvedValue(undefined)
        await controller.deletePlace(places[2].id)
        expect(placeService.delete).toHaveBeenCalledWith(places[2].id)
    })
})