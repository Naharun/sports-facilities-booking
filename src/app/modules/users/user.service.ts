import { User } from './user.model'; // Correct import here
import { CreateUserInput, UserDocument } from './user.interface';

export const createUser = async (
  userData: CreateUserInput,
): Promise<UserDocument> => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const UserService = {
  createUser,
};
