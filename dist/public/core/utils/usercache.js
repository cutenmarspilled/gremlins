export default class UserCache {
    static addUser(user) {
        console.log(`addUser: UserCache before adding ${user.name}: ${UserCache.users.size}`);
        UserCache.users.set(user.id, user);
        console.log(`addUser: UserCache now: ${UserCache.users.size}`);
    }
    static removeUser(user) {
        UserCache.users.delete(user.id);
        console.log(`removeUser: UserCache now: ${UserCache.users.size}`);
    }
    static getUsers() {
        return Array.from(UserCache.users.values());
    }
}
UserCache.users = new Map();
UserCache.getUserBySocket = (id) => {
    return Array.from(UserCache.users.values()).find((user) => user.id === id);
};
