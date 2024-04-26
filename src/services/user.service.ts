import User from "../sequelize/models/users";
import { hashedPassword } from "../utils/hashPassword";
import passport from "passport";
import { Op } from "sequelize";
import Profile, { ProfileAttributes } from "../sequelize/models/profiles";


export const authenticateUser = passport.authenticate("google", {
  scope: ["email", "profile"],
});

export const callbackFn = passport.authenticate("google", {
  successRedirect: "/api/v1/users/auth/google/success",
  failureRedirect: "/api/v1/users/auth/google/failure",
});

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.log("no user");
    }
    return users;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const loggedInUser = async (email: string) => {
  try {
    const user: any = await User.findOne({
      where: { email: email },
    });
    return user;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export const createUserService = async (name: string, email: string, username: string, password: string, role: string): Promise<User | null> => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }
  const hashPassword = await hashedPassword(password);
  let user;

  if (role !== "" || role !== null) {
    user = await User.create({
      name,
      email,
      username,
      password: hashPassword,
      role: [role],
    });
    await Profile.create({ 
      // @ts-ignore
      userId: user.id,
      profileImage:"",
      fullName: "", 
      email: "",
      gender: "", 
      birthdate: "", 
      preferredLanguage: "", 
      preferredCurrency: "", 
      street: "",
      city: "",
      state: "",
      postalCode:"",
      country: "",
     });
    return user;
  } else {
    user = await User.create({
      name,
      email,
      username,
      password: hashPassword,
    });
    await Profile.create({ 
      // @ts-ignore
      userId: user.id,
      profileImage:"",
      fullName: "", 
      email: "",
      gender: "", 
      birthdate: "", 
      preferredLanguage: "", 
      preferredCurrency: "", 
      street: "",
      city: "",
      state: "",
      postalCode:"",
      country: "",
     });
    return user;
  }
 
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({
    where: { email },
  });
  return user;
};

export const findUserById = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log("error seaching user : " + error.message);
    throw new Error(error.message);
  }
};
export const updateUserPassword = async (user: User, password: string) => {
  const update = await User.update({ password: password}, { where: { id: user.id}})
  return update
};

export const getProfileServices = async (userId: number) =>{
   try {
    const getProfile = await Profile.findOne({where: {userId}})
    return getProfile;
   } catch (error) {
    throw new Error ("error during retrieve profile")
   }
}

export const updateProfileServices = async (
    userId: number, 
    profileData: Partial<
    import("../sequelize/models/profiles")
    .ProfileAttributes >) => {
    try {
        const profile = await Profile.findOne({where: {userId}});
        
        if (!profile) {
            throw new Error("No Profile found");
        }
       
        await profile.update(profileData)
    } catch (error) {
       throw new Error("Error in update profile");
    }
}
