
export const createTokenUser = (user) => {
    return {email:user.email,userId:user._id,profileSetup:user.profileSetup}
}
