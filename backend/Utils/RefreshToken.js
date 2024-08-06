import jwt from 'jsonwebtoken';

const GenerateRefreshToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'1d'});
};

export default GenerateRefreshToken;