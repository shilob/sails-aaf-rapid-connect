/**
 * JWS Service
 *
 * @description :: Sails service for validating JWS
 * @author      :: <a href='https://github.com/shilob/'>Shilo Banihit</a>
 */

module.exports = {
    isInvalid: function(jwsStr, req, cb) {
        var jws = require('jws');
        var errMsg = "";
        
        if (jwsStr != "" && jwsStr != null) {
            // signature check
            if (jws.verify(jwsStr, sails.config.auth.algo, sails.config.auth.jwsSecret)) {
                var payload = jws.decode(jwsStr).payload;
                sails.log.debug("Payload:" + JSON.stringify(payload));
                if (typeof payload === "string") {
                  payload = JSON.parse(payload);
                }
                // date and time checking...
                var nowInSecs = Math.ceil(new Date().getTime() / 1000);
                // nbf must be in the past
                if (payload.nbf >= nowInSecs) {
                    sails.log.debug("Current time:" + nowInSecs);
                    sails.log.debug("NBF:" + payload.nbf);
                    cb("NBF Invalid.");
                    return;
                } else
                // exp must be in the future
                if (payload.exp <= nowInSecs) {
                    sails.log.debug("Current time:" + nowInSecs);
                    sails.log.debug("EXP:" + payload.exp);
                    cb("Token expired.");
                    return;
                }
                // check for JTI...
                AafUserLogin.findOne({jti:payload.jti}).then(function(userLogin, err) {
                  if (err) {
                    sails.log.error("Error querying JTI.", err);
                    cb("Error querying JTI");
                    return;
                  } else {
                    if (userLogin) {
                      sails.log.error("JTI already used, possible replay attack.", {payload:payload, ip:req.ip, params:req.allParams()});
                      cb("JTI already used, possible replay attack:" + payload.jti);
                      return;
                    } else {
                      AafUserLogin.create({jti:payload.jti, claimStr:JSON.stringify(payload)})
                        .then(function(userLogin, err) {
                        if (err) {
                          cb("Failed to add JTI");
                          return;
                        } else {
                          cb("");
                          return;
                        }
                      });
                    }
                  }
                });
            } else {
                cb("Invalid signature.");
            }
        } else {
            cb("No JWS");
        }
        
    },
    getPayload: function(jwsStr) {
        var jws = require('jws');
        var decodedObj = jws.decode(jwsStr);
        return decodedObj.payload;
    }
};
