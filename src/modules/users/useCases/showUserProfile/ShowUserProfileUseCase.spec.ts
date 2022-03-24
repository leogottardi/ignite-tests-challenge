import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show the User Profile", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show the user profile", async () => {
    const passwordHash = await hash("123456", 8);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "test@test.com",
      password: passwordHash,
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.id).toBe(user.id);
  });
});
