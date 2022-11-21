import express from "express"
import mongoose from "mongoose"

//models
import User from '../models/user.js'
import HealthHistory from "../models/healthHistory.js"


const router = express.Router()

//create a new health history document in the user's file
export const createHealthHistory = async (req, res)=> {

    User.findById(req.userId, function(err, result) {
    if (!err) {
      if (!result){
        res.status(404).send('User was not found').end();
      }
      else{
        result.healthHistory.unshift(req.body);
        result.markModified('HH'); 
        result.save(function(saveerr, saveresult) {
          if (!saveerr) {
            res.status(200).send(saveresult);
          } else {
            res.status(400).send(saveerr.message);
          }
        });
      }
    } else {
      res.status(400).send(err.message);
    }
  });
}

//READ all HHs
export const getAllUsers = async (req, res) => {
  // if (!req.userId) return res.json({message: 'not authenticated'})
  try {
      const results = await User.find()
      res.status(200).json(results)
  } catch (error) {
      res.status(404).json({message: error.message})
  }   
}


// //CREATE a HH
// export const createHH = async (req, res) => {

//     if (!req.userId) return res.json({message: `not authenticated`})
//     const HH = req.body
//     const newHH = new HHmodel({...HH, patientId: req.userId, createdAt: new Date().toISOString()})
    
//     try {
//         await newHH.save()
//         res.status(200).json(newHH)
//     } catch (error) {
//         res.status(409).json({message: error.message})
//         console.log(error)
//     }
// }

//READ a HH
export const getHH = async (req, res) => {
    const {id: _id} = req.params
    try {
        const result = await User.findById(_id)
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//DELETE a HH

//SEARCH USERS
export const getUserBySearch = async (req, res) => {
  const { searchQuery } = req.query
  try {
    const name = new RegExp(searchQuery, 'i')
    const users = await User.find({ $or: [{firstName: name}, {lastName: name}, {email: name}] })
    if (users?.length === 0) {
      return res.json({message: 'no users found'})
    } else {
      return res.json(users)
    }
  } catch (error) {
    res.status(404).json(error.message)
  }
}

//UPDATE A USER (ADD A SIGNATURE)
export const updateUser = async (req, res) => {
  const { id: _id} = req.params
  try {
    const result = await User.findByIdAndUpdate(_id, req.body, {new: true})
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}

export const addNewHealthHistory = async (req, res) => {
    const healthHistoryData = req.body
    const newHealthHistory = new HealthHistory({...healthHistoryData, clientId: req.userId})
    try {
        await newHealthHistory.save()
        res.status(200).json(newHealthHistory)
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log(error)
    }
}

export const getClientHealthHistory = async (req, res) => {
  const clientId = req.params.clientId
  try {
    const healthHistoryData = await HealthHistory.find({clientId: clientId})
    res.status(200).json(healthHistoryData)
  } catch (error) {
    res.status(404).json({message: error.message})
  }
}

export default router