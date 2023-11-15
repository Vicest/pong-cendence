'use strict'

const ensureAuth = function(req,res,next)
{   
    console.log(req.session)
    //res.status(200).send({session: req.session});
    if(!req.session.token)  //req.headers.authorization
        return res.status(500).send({message: "La peticion requiere del header authorizacion valida, session data: " + req.session});
	next();
}

export { ensureAuth }