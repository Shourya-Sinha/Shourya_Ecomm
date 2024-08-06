import jwt from 'jsonwebtoken';

const GenerateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' }); // expires in 3 day
}

export default GenerateToken;