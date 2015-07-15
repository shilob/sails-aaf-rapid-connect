/**
 * AafController
 *
 * @description :: View Controller for logging in through AAF, main entry point for anything related to AAF.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @author      :: Shilo Banihit
 */

module.exports = {

  /**
   *
   * `AafController.cb()` 
   *
   */
  cb: function (req, res) {
    if (req.body == null || req.body.assertion == null) {
      sails.log.error("AAF Callback called with missing body/assertion, possible probing.");
      return userLoginService.invalidUser("No body assertion text", req, res)
    }
    var claimStr = req.body.assertion;
    var payload = aafJwsService.getPayload(claimStr);
    // check if we have a valid login
    sails.log.debug("In AAF cb, validating login...");
    var isInvalid = aafJwsService.isInvalid(claimStr, req, function(isInvalid) {
      if (isInvalid) {
        sails.log.debug(isInvalid);
        return userLoginService.invalidUser(isInvalid, req, res)
      } else {
        return userLoginService.validUser(payload, req, res)
      }
    });
  },
  
  login: function(req, res) {
    return res.redirect(sails.config.auth.aaf.login_url);
  },
  
  dump: function(req, res) {
    return res.json({params:req.allParams()});
  }
}