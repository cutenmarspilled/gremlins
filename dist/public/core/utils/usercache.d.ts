import User from "../user.js";
export default class UserCache {
    private static readonly users;
    static addUser(user: User): void;
    static removeUser(user: User): void;
    static getUsers(): ReadonlyArray<User>;
    static getUserBySocket: (id: string) => User | undefined;
}
