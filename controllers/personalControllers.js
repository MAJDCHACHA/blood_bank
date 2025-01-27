import db from '../config/index.js';
const {Personal,User,Session }= db;
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();
const num=process.env.NUM
const create_personal = async (req, res) => {
    try {
        const { id, f_name, l_name, father_name, mother_name, birth_date, address, number, gender, id_user } = req.body;

        // Validate required fields
        if (!id || !f_name || !l_name || !father_name || !mother_name || !birth_date || !address || !number || !gender || !id_user) {
            return res.status(400).json({ message: `Bad request: Missing required fields` });
        }

        // Check if the person is over 18
        const today = new Date();
        const birthDate = new Date(birth_date);
        const age = today.getFullYear() - birthDate.getFullYear();
        const ageMonth = today.getMonth() - birthDate.getMonth();
        const ageDay = today.getDate() - birthDate.getDate();

        if (age < num || (age === num && ageMonth < 0) || (age === num && ageMonth === 0 && ageDay < 0)) {
            return res.status(400).json({ message: `personal must be at least 18 years old` });
        }

        // Check if personal record already exists
        const findPersonal = await Personal.findOne({
            where: { id: id }
        });
        if (findPersonal) {
            return res.status(401).json({ message: `personal already exists` });
        }

        // Create personal record
        const personal = await Personal.create({
            id, f_name, l_name, father_name, mother_name, birth_date, address, number, gender, id_user
        });
        res.status(201).json(personal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// const getById = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const findOne = await Personal.findOne({
//         where: { id: id },
//         include: [
//           {
//             model: User,
//             as: 'user', // Matches the alias in the Personal model's association with User
//             attributes: [ 'first_name', 'last_name'], // Specify the User attributes to fetch
//           },
//           {
//             model: Session,
//             as: 'sessions', // Matches the alias in the Personal model's association with Session
//             attributes: ['id','date', 'notes','id_user'], // Specify the Session attributes to fetch
//           },
//          ],
    
//       });
  
//       if (!findOne) {
//         return res.status(203).json({ message: `No Content` });
//       } else {
//         return res.status(200).json(findOne);
//       }
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   };  
const getAll_unknown=async(req,res)=>{
    try{
        const findAll=await Personal.findAll({
            include:[
                {
                    model:User,
                    as:`user`,
                    attributes: ['id','first_name', 'last_name'], // Fetch the user's name
                }
            ],
            where:{
                blood_type:`unknown`
            }
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
const update_personal=async(req,res)=>{
    try{
        const {id,f_name,l_name,father_name,mother_name,birth_date,address,number,gender,blood_type}=req.body
        const findOne=await Personal.findOne({
            where:{
                id:id
            }
        })
        if(findOne){
           const edit=await Personal.update({id:id,f_name:f_name,l_name:l_name,father_name:father_name,mother_name:mother_name,birth_date:birth_date,address:address,number:number,gender,blood_type:blood_type},{
                where:{id:id}
            })
            return res.status(200).json(edit);
        }
        else{
            return res.status(203).json({message:`No Content`});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}
const update_blood=async(req,res)=>{
    try{
        const {id,blood_type}=req.body;
        const findOne=await Personal.findOne({
            where:{
                id:id
            }
        })
        if(findOne){
            const edit=await Personal.update({blood_type:blood_type},{
                where:{id:id}
            })
            if(edit) {
                return res.status(200).json({message:`Edit Success`});
            }
        }
        else{
            return res.status(203).json({message:`No Content`});
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const delete_personal=async(req,res)=>{
    try{
        const {id}=req.body;
        const deleteOne=await Personal.destroy({
            where:{
                id:id
            }
        })
        if(deleteOne){
            return res.status(200).json({message:`Deleted Successfully`});
        }
        else{
            return res.status(203).json({message:`No Content`});
        }
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
const getAll = async (req, res) => {
    try {
      const findAll = await Personal.findAll({
        where: {
          blood_type: {
            [Op.ne]: 'unknown', // Condition to exclude records where blood_type is 'unknown'
          },
        },
        include: [
          {
            model: User,
            as: 'user', // Specify the alias here
            attributes: ['id', 'first_name', 'last_name'], // Fetch specific attributes from User
          },
        ],
      });
  
      if (findAll.length > 0) {
        return res.status(200).json(findAll);
      } else {
        return res.status(203).json({ message: 'No Personal Records Found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
};
// const getDate=async(req,res)=>{
//     try {
//         const {date}=req.body;
//         const findAll = await Personal.findAll({
//           where: {
//             blood_type: {
//               [Op.ne]: 'unknown', // Condition to exclude records where blood_type is 'unknown'
//             },
//             where:{date:date}
//           },
//           include: [
//             {
//               model: User,
//               as: 'user', // Specify the alias here
//               attributes: ['id', 'first_name', 'last_name'], // Fetch specific attributes from User
//             },
//           ],
//           include:[
//             {
//                 model: Session,
//                 as:'sessions', // Specify the alias here
//                 attributes: ['id','date', 'notes'], // Fetch specific attributes from Session
                
//             }
        
//           ]
//         });
//         const findSession=await Session.findAll({
//             where:{date:date},
//             model: Personal,
//             as: 'personal', // Specify the alias here
//             attributes: ['id', 'first_name', 'last_name'], // Fetch specific attributes from User

//         })
    
//         if (findAll.length > 0) {
//           return res.status(200).json(findAll);
//         } else {
//           return res.status(203).json({ message: 'No Personal Records Found' });
//         }
//       } catch (err) {
//         return res.status(500).json({ message: err.message });
//       } 
// }
const getDate = async (req, res) => {
    try {
      const today = new Date();  // Get the current date
      const year = today.getFullYear();  // Get the year
      const month = String(today.getMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so add 1) and pad to 2 digits
      const day = String(today.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`;
  
      // Fetching Personal records with related User and Session data
      const findAll = await Personal.findAll({
        where: {
          blood_type: {
            [Op.ne]: 'unknown', // Exclude records where blood_type is 'unknown'
          }
       
        },
        include: [
          {
            model: Session,
            as: 'sessions', // Alias used in associations
            where: { date:date }, // Filter sessions by the given date
            attributes: ['id', 'date', 'notes'], // Fetch specific attributes from Session
            include: [
              {
                  model: User,
                  as: 'user', // Alias in the Session model's association with User
                  attributes: ['first_name', 'last_name'],
              },
          ], 
          },
         
        ],
      });
  
      // Check if records are found
      if (findAll.length > 0) {
        return res.status(200).json(findAll);
      } else {
        return res.status(203).json({ message: 'No Personal Records Found for the specified date' });
      }
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
};
  const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const findOne = await Personal.findOne({
            where: { id: id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name'],
                },
                {
                    model: Session,
                    as: 'sessions',
                    attributes: ['id', 'date', 'notes'], // Exclude `id_user`
                    include: [
                        {
                            model: User,
                            as: 'user', // Alias in the Session model's association with User
                            attributes: ['first_name', 'last_name'],
                        },
                    ],
                },
            ],
        });

        if (!findOne) {
            return res.status(203).json({ message: `No Content` });
        } else {
            const transformedData = {
                ...findOne.toJSON(),
                sessions: findOne.sessions.map((session) => ({
                    id: session.id,
                    date: session.date,
                    notes: session.notes,
                    first_name: session.user?.first_name, // Fetch from nested include
                    last_name: session.user?.last_name, // Fetch from nested include
                })),
            };
            return res.status(200).json(transformedData);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// const getDate_unKnow=async(req,res)=>{
//     try {
//       const today = new Date();  // Get the current date
//       const year = today.getFullYear();  // Get the year
//       const month = String(today.getMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so add 1) and pad to 2 digits
//       const day = String(today.getDate()).padStart(2, '0');
//       const date = `${year}-${month}-${day}`;
    
//         // Fetching Personal records with related User and Session data
//         const findAll = await Personal.findAll({
//           where: {
//             blood_type: 
//                'unknown' // Exclude records where blood_type is 'unknown'
//             ,
//           },
//           include: [
//             {
//               model: Session,
//               as: 'sessions', // Alias used in associations
//               where: { date }, // Filter sessions by the given date
//               attributes: ['id', 'date', 'notes'], // Fetch specific attributes from Session
//             },
//             {
//               model: User,
//               as: 'user', // Alias used in associations
//               attributes: ['id', 'first_name', 'last_name'], // Fetch specific attributes from User
//             },
//           ],
//         });
    
//         // Check if records are found
//         if (findAll.length > 0) {
//           return res.status(200).json(findAll);
//         } else {
//           return res.status(203).json({ message: 'No Personal Records Found for the specified date' });
//         }
//       } catch (err) {
//         // Handle errors
//         return res.status(500).json({ message: err.message });
//       }
// }
const getDate_unKnow = async (req, res) => {
  try {
    const today = new Date();  // Get the current date
    const year = today.getFullYear();  // Get the year
    const month = String(today.getMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so add 1) and pad to 2 digits
    const day = String(today.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    // Fetching Personal records with related User and Session data
    const findAll = await Personal.findAll({
      where: {
        blood_type: 'unknown', // Exclude records where blood_type is 'unknown'
      },
      include: [
        {
          model: Session,
          as: 'sessions', // Alias used in associations
          where: { date }, // Filter sessions by the given date
          attributes: ['id', 'date', 'notes'],
          include: [
            {
                model: User,
                as: 'user', // Alias in the Session model's association with User
                attributes: ['first_name', 'last_name'],
            },
        ], // Fetch specific attributes from Session
        },
    
      ],
    });

    // Check if records are found
    if (findAll.length > 0) {
      return res.status(200).json(findAll);
    } else {
      return res.status(203).json({ message: 'No Personal Records Found for the specified date' });
    }
  } catch (err) {
    // Handle errors
    return res.status(500).json({ message: err.message });
  }
};
const getDate_date = async (req, res) => {
  try {

    const {date}=req.params;

    // Fetching Personal records with related User and Session data
    const findAll = await Personal.findAll({
      where: {
        blood_type: {
          [Op.ne]: 'unknown', // Exclude records where blood_type is 'unknown'
        },
     
      },
      include: [
        {
          model: Session,
          as: 'sessions', // Alias used in associations
          where: { date:date }, // Filter sessions by the given date
          attributes: ['id', 'date', 'notes'],
          include: [
            {
                model: User,
                as: 'user', // Alias in the Session model's association with User
                attributes: ['first_name', 'last_name'],
            },
        ], // Fetch specific attributes from Session
        },
      
      ],
    });

    // Check if records are found
    if (findAll.length > 0) {
      return res.status(200).json(findAll);
    } else {
      return res.status(203).json({ message: 'No Personal Records Found for the specified date' });
    }
  } catch (err) {
    // Handle errors
    return res.status(500).json({ message: err.message });
  }
};
export default {getAll,getById,update_personal,delete_personal,create_personal,update_blood,getAll_unknown,getDate,getDate_unKnow,getDate_date};