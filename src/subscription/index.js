import { PubSub } from "apollo-server";

import * as WORKORDER_EVENTS from "./workorder";

export const EVENTS = {
  WORKORDER: WORKORDER_EVENTS
};

export default new PubSub();
