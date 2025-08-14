import { eq } from 'drizzle-orm';
import db from '@/drizzle/index';
import { usersTable, type User, type NewUser } from '@/drizzle/schema';

export class UserRepository {
  /**
   * Retrieves all users from the database
   */
  async findAllAsync(): Promise<User[]> {
    return await db.select().from(usersTable);
  }

  /**
   * Retrieves a user by their ID
   */
  async findByIdAsync(id: number): Promise<User | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return result[0] || null;
  }

  /**
   * Finds a user by their organization
   * @param organization - The organization to find a user by
   * @returns The user if found, otherwise null
   */
  async findByOrganizationAsync(organization: string): Promise<User | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.organization, organization));
    return result[0] || null;
  }

  /**
   * Creates a new user in the database
   */
  async createAsync(userData: NewUser): Promise<User> {
    console.log(userData);
    const result = await db
      .insert(usersTable)
      .values({
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return result[0];
  }

  /**
   * Updates an existing user in the database
   */
  async updateAsync(
    id: number,
    userData: Partial<NewUser>
  ): Promise<User | null> {
    const result = await db
      .update(usersTable)
      .set({ ...userData, updated_at: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] || null;
  }

  /**
   * Deletes a user from the database
   */
  async deleteAsync(id: number): Promise<boolean> {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return result.length > 0;
  }

  /**
   * Finds a user by email address
   */
  async findByEmailAsync(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] || null;
  }
}
