import User from "../user.js";
import gtvMessage from "./gtvmessage.js";
export default class gtvWelcome {
    readonly selfName: string;
    readonly users: readonly User[];
    readonly msgs: readonly gtvMessage[];
    constructor(selfName: string, users: readonly User[], msgs: readonly gtvMessage[]);
}
