import { expect } from "chai";
import * as userApi from "./api";
describe("user", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async () => {
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

describe("users", () => {
  describe("users: User", () => {
    it("returns users", async () => {
      const expectedResult = {
        data: {
          users: [
            {
              username: "bryant",
              email: "bryantpatton@gmail.com",
              role: "ADMIN",
              phone: "4153163549",
              authyId: "82620055",
              workorders: [
                {
                  id: "1",
                  title: "paint the dining area",
                  qrcode: "000002"
                }
              ]
            },
            {
              username: "skylerd",
              email: "skyler2440@gmail.com",
              role: "ADMIN",
              phone: "3523904132",
              authyId: "190296236",
              workorders: [
                {
                  id: "2",
                  title: "fix broken sink in unit 101",
                  qrcode: "000001"
                }
              ]
            }
          ]
        }
      };
      const result = await userApi.users();
      expect(result.data).to.eql(expectedResult);
    });
  });
});
