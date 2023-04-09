export default class UserCache {
    static addUser(user) {
        console.log(`adding user ${user.name} to cache`);
        UserCache.users.set(user.id, user);
    }
    static removeUser(user) {
        UserCache.users.delete(user.id);
    }
    static getUsers() {
        return Array.from(UserCache.users.values());
    }
}
UserCache.users = new Map();
UserCache.getUserBySocket = (id) => {
    return Array.from(UserCache.users.values()).find((user) => user.id === id);
};
