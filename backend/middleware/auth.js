import jwt from 'jsonwebtoken';
const secret = "aTWbeQsdwdevd122421jhjgngh@#@!#$awwqQe"

export default async function Auth(req, res, next){
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrive the user details fo the logged in user
        const decodedToken = jwt.verify(token, secret , {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
        req.user = decodedToken;
        next()

    } catch (error) {
        res.json({ error : "Authentication Failed!"})
    }
}


// export function localVariables(req, res, next){
//     req.app.locals = {
//         OTP : null,
//         resetSession : false
//     }
//     next()
// }
