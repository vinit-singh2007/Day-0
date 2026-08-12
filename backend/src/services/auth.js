import jwt from "jsonwebtoken";

const setUser=(newUser)=>{
    const secretkey=process.env.JWT_SECRET_KEY
    return jwt.sign({id:newUser._id,email:newUser.email},secretkey,{expiresIn: "3d"})
}

const getUser=(token)=>{
    // if(!token) return null
    try{
        return jwt.verify(token,secretkey);
    }catch{
        return null
    }
    
}

export {setUser,getUser};