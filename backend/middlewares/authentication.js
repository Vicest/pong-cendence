"use strict";

const ensureAuth = function (req, res, next) {
  if (!req.session.token)
    //req.headers.authorization
    return res.status(500).send({
      message:
        "La peticion requiere del header authorizacion valida, session data: " +
        JSON.stringify(req.session),
    });
  next();
};

export { ensureAuth };
