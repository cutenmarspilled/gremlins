// import gtvMessage from "./gtvmessage.js";

import User from "../user.js";
import gtvMessage from "./gtvmessage.js";

export default class gtvWelcome {
  constructor(
    public readonly selfName: string,
    public readonly users: readonly User[],
    public readonly msgs: readonly gtvMessage[]
  ) {}
}
