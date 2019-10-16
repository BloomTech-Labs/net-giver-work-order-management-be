import axios from "axios";
const API_URL = "http://localhost:3000/graphql";
export const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables
  });

export const users = async variables =>
  axios.post(API_URL, {
    query: `
      query {
            users {
            username
            email
            role
            phone
            authyId
            workorders {
                id
                title
                qrcode
            }
        }
      }
    `,
    variables
  });
