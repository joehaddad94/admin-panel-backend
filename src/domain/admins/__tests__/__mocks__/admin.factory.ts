import { Admin } from '../../../../core/data/database';

export class AdminFactory {
  static createMockAdmin(overrides: Partial<Admin> = {}): Admin {
    const defaultAdmin: Partial<Admin> = {
      id: 1,
      name: 'Test Admin',
      email: 'test@example.com',
      password: 'hashedPassword123',
      created_at: new Date('2023-01-01T00:00:00Z'),
      updated_at: new Date('2023-01-01T00:00:00Z'),
      is_active: true,
      login_attempts: 5,
      reset_token: null,
      reset_token_expiry: null,
      created_by_id: 1,
      updated_by_id: 1,
    };

    return { ...defaultAdmin, ...overrides } as Admin;
  }

  static createMockAdminList(count: number, overrides: Partial<Admin> = {}): Admin[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockAdmin({
        id: index + 1,
        name: `Admin ${index + 1}`,
        email: `admin${index + 1}@example.com`,
        ...overrides,
      })
    );
  }



  static createAdminResponse(admin: Admin) {
    const { password, updated_at, ...adminData } = admin;
    return {
      adminData,
      message: 'Admin added succesfully.',
    };
  }

  static createGetAdminsResponse(admins: Admin[], page: number = 1, pageSize: number = 10) {
    const formattedAdmins = admins.map(({ password, reset_token, reset_token_expiry, created_at, is_active, ...admin }) => ({
      ...admin,
      created_at: '01-01-23', // formatted date
      is_active: is_active ? 'Yes' : 'No',
    }));

    return {
      admins: formattedAdmins,
      total: admins.length,
      page,
      pageSize,
    };
  }

  static createDeleteAdminResponse(deletedIds: number[]) {
    return {
      message: 'Admin(s) successfully deleted.',
      deletedIds,
    };
  }

  static createInviteResponse(link: string) {
    return { link };
  }

  static createMockAdminWithResetToken(overrides: Partial<Admin> = {}): Admin {
    return this.createMockAdmin({
      reset_token: 'resetToken123',
      reset_token_expiry: new Date(Date.now() + 3600000), // 1 hour from now
      ...overrides,
    });
  }

  static createMockAdminWithPassword(password: string, overrides: Partial<Admin> = {}): Admin {
    return this.createMockAdmin({
      password,
      ...overrides,
    });
  }


}

