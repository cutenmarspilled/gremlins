import User from "../user.js";
export default class gtvWelcome {
    readonly selfName: string;
    readonly users: readonly User[];
    constructor(selfName: string, users: readonly User[]);
}
