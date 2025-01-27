import db from "../config/index.js";
const {Admin,User}=db;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from 'path'
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});
const upload = multer({ storage: storage });
dotenv.config();
// Controllers_admin
const register_admin = async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: `Bad Request` });
      }
  
      const foundUser = await Admin.findOne({
        where: {
          name: name,
          password: password,
        },
      });
  
      if (foundUser) {
        return res.status(401).json({ message: `User already exists` });
      } else {
        const newUser = await Admin.create({
          name: name,
          password: password,
        });
  
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: newUser.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
  
        const refreshToken = jwt.sign(
          {
            UserInfo: {
              id: newUser.id,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
  
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res
          .status(201)
          .json({ accessToken: accessToken, name: newUser.name, id: newUser.id,getAllInfo:getAllInfo });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  const login_admin = async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: `Bad Request` });}
      const foundUser = await Admin.findOne({
        where: {
          name: name,
          password: password,
        },
      });
      if (!foundUser) {
        return res.status(401).json({ message: `User does not exist` });
      } else {
        const accessToken = jwt.sign({UserInfo: {id: foundUser.id,
          name:foundUser.name,
          password:foundUser.password
        },},process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d"}
        );
        const refreshToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser.id,
              name:foundUser.name,
              password:foundUser.password
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
          accessToken: accessToken,
          name: foundUser.name,
          id: foundUser.id,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  const refresh_admin = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
      res.status(401).json({ message: ` unauthorized` });
    } else {
      const refresh_Token = cookie.jwt;
      jwt.verify(
        refresh_Token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.status(403).json({ message: `Forbidden` });
          const foundUser = await Admin.findByPk(decoded.UserInfo.id);
          if (!foundUser)
            return res.status(401).json({ massage: `Unauthorized` });
          const accessToken = jwt.sign(
            {
              UserInfo: {
                id: foundUser.id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          return res.json({ accessToken: accessToken });
        }
      );
    }
  };
  const logout_admin = async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.status(204).json({ message: "No content to log out" }); // Use 204 (No Content) for empty responses
      } else {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return res.status(200).json({ message: "Logout successful" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  // Controllers_user
  const register_user = async (req, res) => {
    try {
      const image = req.file ? req.file.filename : null;
      const { first_name, last_name, email, password ,permissions} = req.body;
  
      if (!first_name || !last_name || !email || !password||!permissions,!image) {
        return res.status(400).json({ message: `Bad Request` });
      }
  
      const foundUser = await User.findOne({
        where: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          permissions:permissions
        },
      });
  
      if (foundUser) {
        return res.status(401).json({ message: `User already exists` });
      } else {
        const newUser = await User.create({
          first_name,
          last_name,
          email,
          password,
          permissions,
          image
        });
        res.status(200).json({
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          password:newUser.password,
          permissions:newUser.permissions,
          id: newUser.id,
          image:newUser.image
        });
      }
    } catch (err) {
       res.status(500).json({ message: err.message });
    }
  };
  const login_user = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: `Bad Request` });
      }
  
      const foundUser = await User.findOne({
        where: {
          email,
          password,
        },
      });
  
      if (!foundUser) {
        return res.status(401).json({ message: `User does not exist` });
      } 
      else if (foundUser.isDelete===true){
        return res.status(404).json({message:`user is blocked`})
      }
      else {
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
  
        const refreshToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser.id,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
  
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
  
        return res.status(200).json({
          accessToken,
          first_name: foundUser.first_name,
          last_name: foundUser.last_name,
          email: foundUser.email,
          id: foundUser.id,
          permissions:foundUser.permissions, 
          isDelete:foundUser.isDelete
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  const refresh_user = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
      res.status(401).json({ message: ` unauthorized` });
    } else {
      const refresh_Token = cookie.jwt;
      jwt.verify(
        refresh_Token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.status(403).json({ message: `Forbidden` });
          const foundUser = await User.findByPk(decoded.UserInfo.id);
          if (!foundUser)
            return res.status(401).json({ massage: `Unauthorized` });
          const accessToken = jwt.sign(
            {
              UserInfo: {
                id: foundUser.id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          return res.json({ accessToken: accessToken });
        }
      );
    }
  };
  const logout_user = async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.status(204).json({ message: "No content to log out" }); // Use 204 (No Content) for empty responses
      } else {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return res.status(200).json({ message: "Logout successful" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  const get_user=async(req,res)=>{
    try{
      const getUser=await User.findAll({
        where:{isDelete:0}
      });
      if(!getUser || getUser.length===0){
        return res.status(203).json({message:`No Content`})
      }
      else{
        return res.status(200).json(getUser);
      }
    }
    catch(err){
      return res.status(500).json({ message: err.message });
    }
  }
  const get_user_blocked=async(req,res)=>{
    try{
      const getUser=await User.findAll({
        where:{isDelete:1}
      });
      if(!getUser || getUser.length===0){
        return res.status(203).json({message:`No Content`})
      }
      else{
        return res.status(200).json(getUser);
      }
    }
    catch(err){
      return res.status(500).json({ message: err.message });
    }
  }
  const delete_user=async(req,res)=>{
    try{
      const {id}=req.body;
      const user_delete=await User.destroy({where:{id:id}});
      return res.status(200).json({message:`Successfully deleted`});
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
  }
  const edit_user = async (req, res) => {
    try {
      const { id, isDelete } = req.body;
  
      // Ensure required fields are provided
      if (!id || typeof isDelete === 'undefined') {
        return res.status(400).json({ message: "id and isDelete are required" });
      }
  
      // Perform the update operation
      const [updatedRows] = await User.update(
        { isDelete }, // Correct field name
        { where: { id } }
      );
  
      // Check if the update was successful
      if (updatedRows > 0) {
        return res.status(200).json({ message: "User updated successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  export default {
    register_admin,
    login_admin,
    refresh_admin,
    logout_admin,
    register_user,
    login_user,
    refresh_user,
    logout_user,
    get_user,
    delete_user,
    edit_user,
    get_user_blocked,
    upload
  };
  