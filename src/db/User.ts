import { faker } from "../../deps.ts";
import { DbOperations } from "./operations.ts";

class User extends DbOperations {
  constructor() {
    super("users");
  }

  seed = async (records = 20) => {
    for (let i = 1; i <= records; i++) {
      const data = {
        id: i,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        created_at: Date.now(),
        amount: +faker.commerce.price(),
        walletAddress: faker.finance.ethereumAddress(),
      };
      await this.insert(data);
    }
  };
}

export const user = new User();
