import { PubSub } from "apollo-server";

import * as MESSAGE_EVENTS from "./workorder";

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS
};

export default new PubSub();
