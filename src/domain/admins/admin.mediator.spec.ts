/* eslint-disable camelcase */
import { AdminMediator } from './admin.mediator';
import { ManualCreateDto } from './dto/manual.create.dto';

describe('Admin Mediator', () => {
  // define global variables
  const adminData = {
    id: 1,
    name: 'test',
    email: 'test@example.io',
    created_at: new Date(),
    updated_at: new Date(),
    is_active: false,
    reset_token: '123456',
    reset_token_expiry: new Date(),
    login_attempts: 1,
  };

  const createAdminData: ManualCreateDto = {
    email: 'test@example.io',
    name: 'test',
  };

  let adminMeditaor: AdminMediator;
  let manualCreateSpy;

  // before each => create spies
  beforeEach(() => {
    adminMeditaor = new AdminMediator(undefined, undefined);

    manualCreateSpy = jest
      .spyOn(adminMeditaor, 'manualCreate')
      .mockImplementationOnce(() => Promise.resolve(adminData));
  });

  // after each => clear mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  // tests
  test('Manual Admin Create Test', async () => {
    const result = await adminMeditaor.manualCreate(createAdminData);

    expect(manualCreateSpy).toBeCalledTimes(1);
    expect(manualCreateSpy).toBeCalledWith(createAdminData);
    expect(result).toEqual(adminData);
  });
});
