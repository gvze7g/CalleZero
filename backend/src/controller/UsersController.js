//Users Model: fullname, email, Passsword, isActive, createdAt
import modelUsers from "../models/users.js";

const controllerUsers = {};


controllerUsers.getAll = async (req,res) => {
    try {
        const users = await modelUsers.find().select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

controllerUsers.updateUsers = async (req,res) => {
    try {
        const {fullname, email, Passsword, isActive, createdAt} = req.body;
        await modelUsers.findByIdAndUpdate(req.params.id,{fullname, email, Passsword, isActive, createdAt},{new:true});
        res.status(200).json({message:"Users has Updated"});
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error"}); 
    }
}


controllerUsers.deleteUsers = async (req,res) => {
    try {
        const users = await modelUsers.findByIdAndDelete(req.params.id);
        if(!users){
            return res.status(404).json({message:"users not found"});
        }
        return res.status(200).json({message:"users has been Deleted"})
    } catch (error) {
        console.log("Error: " + error);
        return res.status(500).json({ message: "Internal server error"});   
    }
}

export default controllerUsers;