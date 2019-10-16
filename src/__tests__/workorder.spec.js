import { expect } from "chai";
import * as userApi from "./api";
describe("workorder", () => {
  describe("workorder(qrcode: String!): Workorder", () => {
    it("returns a workorder when a workorder can be found", async () => {
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "bryant",
            email: "bryantpatton@gmail.com",
            role: "ADMIN"
          }
        }
      };
      const result = await userApi.user({ id: "1" });
      expect(result.data).to.eql(expectedResult);
    });
  });
});
