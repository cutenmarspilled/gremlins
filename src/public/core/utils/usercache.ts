import User from "../user.js";

export default class UserCache {
  private static readonly users: Map<string, User> = new Map<string, User>();

  static addUser(user: User) {
    console.log(`adding user ${user.name} to cache`);
    UserCache.users.set(user.id, user);
  }

  static removeUser(user: User) {
    UserCache.users.delete(user.id);
  }

  static getUsers(): ReadonlyArray<User> {
    return Array.from(UserCache.users.values());
  }

  static getUserBySocket = (id: string): User | undefined => {
    return Array.from(UserCache.users.values()).find((user) => user.id === id);
  };
}
