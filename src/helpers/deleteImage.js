import fs from "fs";
const fileSys = fs.promises;

const deleteImage = async (userImagePath) => {
    try {
        await fileSys.access(userImagePath)
        await fileSys.unlink(userImagePath)
        console.log("user image was deleted")
    } catch (error) {
        console.error("user image doesn,t exist")
    }
};
export default deleteImage;