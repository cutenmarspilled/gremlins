import User from "../user.js";

export default class UserCache {
  public static users: Map<string, User> = new Map<string, User>();

  static addUser(user: User) {
    console.log(`addUser: UserCache before adding ${user.name}: ${UserCache.users.size}`);
    UserCache.users.set(user.id, user);
    console.log(`addUser: UserCache now: ${UserCache.users.size}`);
  }

  static removeUser(user: User) {
    UserCache.users.delete(user.id);

    console.log(`removeUser: UserCache now: ${UserCache.users.size}`);
  }

  static getUsers(): ReadonlyArray<User> {
    return Array.from(UserCache.users.values());
  }

  static getUserBySocket = (id: string): User | undefined => {
    return Array.from(UserCache.users.values()).find((user) => user.id === id);
  };
}
