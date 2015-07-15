/**
* AafUserLogin.js
*
* @description :: Represents a successful AAF User login
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    jti: {
      type:'string',
      unique:true,
      required:true
    },
    claimStr: {
      type:'string',
      unique:false,
      required: true
    }
  }
};

