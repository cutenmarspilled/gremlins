// import gtvMessage from "./gtvmessage.js";

import User from "../user.js";

export default class gtvWelcome {
  constructor(
    public readonly selfName: string,
    public readonly users: readonly User[]
  ) {}
}
