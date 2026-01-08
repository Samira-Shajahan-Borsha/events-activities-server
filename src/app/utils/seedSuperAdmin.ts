import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { Profile } from "../modules/profile/profile.model";
import { IAuthProvider, IUser, ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const isSuperAdminExist = await User.findOne({ role: ROLE.ADMIN }, null, { session });

        if (isSuperAdminExist) {
            console.log("Super admin already exists");
            await session.abortTransaction();
            return;
        }

        const hashedPassword = await bcrypt.hash(
            envVars.SUPER_ADMIN_PASSWORD,
            Number(envVars.BCRYPT_SALT_ROUND)
        );

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL,
        };

        const payload: Partial<IUser> = {
            fullName: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: ROLE.ADMIN,
            auths: [authProvider],
        };

        const superAdmin = await User.create([payload], { session });

        await Profile.create(
            [
                {
                    user: superAdmin[0]._id,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        console.log("Super admin created successfully");
    } catch (error) {
        await session.abortTransaction();
        console.error("Error while seeding super admin:", error);
    } finally {
        session.endSession();
    }
};
