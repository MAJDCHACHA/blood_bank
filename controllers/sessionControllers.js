import { Op } from 'sequelize';
import db from '../config/index.js';
import dotenv from 'dotenv'
const {Personal,Session,User}=db;
// const create_session=async(req,res)=>{
//     try{
//         const {id_user,id_personal,notes,date}=req.body
//         if(!id_user || !id_personal || !notes|| !date){
//             return res.status(400).json({message:`Pad req`})
//         }
//         else
//         {   const findSession = await Session.findOne({
//             where:{
//                 date:date
//             }
//         }
//         ) 
//         if(findSession){
//             return res.status(200).json({message:`Session already exists`})
//         }
//         else{
//             const insert =await Session.create({id_user,id_personal,notes,date});
//             return res.status(200).json(insert);
//         }
            
//         }
//     }
//     catch(err){
//         return res.status(500).json({message:err.message});
//     }
// }
dotenv.config();
const num=30
const create_session = async (req, res) => {
    try {
        const { id_user, id_personal, notes, date } = req.body;

        // Validate required fields
        if (!id_user || !id_personal || !notes || !date) {
            return res.status(400).json({ message: `Missing required fields` });
        }

        // Check if a session exists on the same date or within 30 days
        const findSession = await Session.findOne({
            where: {
                date: {
                    [Op.between]: [
                        new Date(new Date(date).setDate(new Date(date).getDate() - num)), // 30 days before
                        new Date(new Date(date).setDate(new Date(date).getDate() + num))  // 30 days after
                    ]
                },
                id_personal:id_personal
            }
        });

        if (findSession) {
            return res.status(400).json({ message: `Session already exists within 30 days of the given date` });
        }

        // Create the new session
        const insert = await Session.create({ id_user, id_personal, notes, date });
        if(insert){
            return res.status(200).json({message:`Session created successfully `});
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getById=async(req,res)=>{
    try{
        const {id}=req.body;
        if(!id){
            return res.status(400).json({message:`Pad req`});
        }
        else{
            const findSession=await Session.findOne({where:{id:id}});
            if(findSession){
                return res.status(200).json(findSession);
            }
            else{
                return res.status(203).json({message:`No Content`});
            }
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const delete_Session=async (req,res)=>{
    try{
        const {id}=req.body;
        if(!id){
            return res.status(400).json({message:`Pad req`});
        }
        else{
            const findSession=await Session.findOne({where:{id:id}});
            if(findSession){
                await Session.destroy({where:{id:id}});
                return res.status(200).json({message:`Delete success`})
            }
            else{
                return res.status(203).json({message:`No Content`});
            }
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const getDateDay=async(req,res)=>{
    try{
        const createTimestamp=req.body;
        const findAll=await Session.findAll({where:{createTimestamp:createTimestamp}},{
            include:[{
                model:Personal,
                as:`personal`,
                attributes:['id','f_name','l_name','blood_type']
            },
            {
                model:User,
                as:`user`,
                attributes:['id','first_name','last_name']
            }]
        });
        if(findAll && findAll.length>0){
            return res.status(200).json(findAll);
        }
        else{
            return res.status(203).json({message:`No Content`});
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const getAllSession=async(req,res)=>{
    try{
        const findAll=await Session.findAll({
            include:[
                {
                    model:Personal,
                    as:`personal`,
                    attributes:['id','f_name','l_name','blood_type']
                }
            ]
        })
        if(findAll && findAll.length>0){
            return res.status(200).json(findAll);
        }
        else{
            return res.status(203).json({message:`No Content`});
        }

    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
export default {create_session,getById,delete_Session,getDateDay,getAllSession};