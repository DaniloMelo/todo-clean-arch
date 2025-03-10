import errors from "@/core/shared/errors"
import IUser from "@/core/user/models/IUser"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import RegisterUser from "@/core/user/services/RegisterUser"

describe("Test RegisterUser.ts use case", () => {
  let registerUser: RegisterUser;
  let mockCrypgraphyService: jest.Mocked<IPasswordCryptography>;
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockCrypgraphyService = {
      encrypt: jest.fn(),
      compare: jest.fn()
    }

    mockUserRepository = {
      create: jest.fn(),
      readByEmail: jest.fn()
    }

    registerUser = new RegisterUser(mockUserRepository, mockCrypgraphyService)
  })

  it("Should throw an error if user already exists", async () => {
    const user: IUser = { name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }

    mockUserRepository.readByEmail.mockResolvedValue(user)

    await expect(registerUser.execute(user)).rejects.toThrow(errors.USER_EXISTS)
    expect(mockCrypgraphyService.encrypt).not.toHaveBeenCalled()
    expect(mockUserRepository.create).not.toHaveBeenCalled()
  })

  it("Should successfully register a new user", async () => {
    const newUser: IUser = { name: "John Doe", email: "john@email.com", password: "P4ssW0rd@123" }

    mockUserRepository.readByEmail.mockResolvedValue(null)
    mockCrypgraphyService.encrypt.mockResolvedValue("encryptedP4ssW0rd@123")

    await registerUser.execute(newUser)

    expect(mockUserRepository.readByEmail).toHaveBeenCalledWith(newUser.email)
    expect(mockCrypgraphyService.encrypt).toHaveBeenCalledWith(newUser.password)
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: newUser.name,
      email: newUser.email,
      password: "encryptedP4ssW0rd@123"
    })
  })
})
