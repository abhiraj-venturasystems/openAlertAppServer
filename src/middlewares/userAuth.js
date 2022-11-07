import messageHelper from '../helpers/messages.js';
import jwtHelper from '../helpers/jwt.js';

export const verifyToken = () => {
	return async (req, res, next) => {
        try { 
            //token from localstorage is added to request header's Authorization property using http interceptors
            //Here checking that whether that token is exists or not with the request headers
            const token = req.header('Authorization');
            if(!token){
                throw Error(messageHelper.TOKEN_REQUIRED);
            }
        
            const user = await jwtHelper.decryptToken(token);
            req.user = user;
            next();

        }catch(error){
            next(error);
        }
    }
}
