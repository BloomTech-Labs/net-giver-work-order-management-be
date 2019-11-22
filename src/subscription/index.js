import { PubSub } from "apollo-server";

import * as WORKORDER_EVENTS from "./workorder";
import * as COMMENT_EVENTS from "./comments";

export const EVENTS = {
  WORKORDER: WORKORDER_EVENTS,
  COMMENT: COMMENT_EVENTS
};

export default new PubSub();
