const { UserModel } = require("../model/user.model");

const getUserById = async (userId, populated) => {
    try {

        if (populated == "cart") {
            const user = await UserModel.findById(userId).populate("cart.productId");
            return user;
        }else if (populated == "wishlist") {
            const user = await UserModel.findById(userId).populate("wishlist.productId");
            return user;
        }
        else {
            const user = await UserModel.findById(userId);
            return user;
        }

    } catch (err) {
        throw Error(err);
    }
};
const getUserByEmail = async (userEmail, populated) => {
    try {
        if (populated == "populated") {
            const user = await UserModel.findOne({
                email: userEmail,
            }).populate("wishlist.productId cart.productId");
            return user;
        } else {
            const user = await UserModel.findOne({
                email: userEmail,
            });
            return user;
        }
    } catch (err) {
        throw Error(err);
    }
};
module.exports = {getUserById, getUserByEmail };
