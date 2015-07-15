# Sails AAF Rapid Connect

If you're using [Sails.js](http://sailsjs.org/), an even more rapid way of authenticating with AAF :)

## Installation

Install the module in your Sails app:

```bash
$ npm install sails-aaf-rapid-connect --save
```

Create a service named 'userLoginService' with the following methods:

```js
module.exports = {
  /**
  * payload - Object, AAF attributes, see RapidAAF documentation
  * req - Sails.js request object
  * res - Sails.js response object
  */
  validUser: function(payload, req, res) {
    // called when user is valid, you can do whatever you want, etc.
    // return res.redirect(url);
  },
  /**
  * reason - string 
  * req - Sails.js request object
  * res - Sails.js response object
  */
  invalidUser: function(reason, req, res) {
    sails.log.error("User failed to login: " + reason);
    return res.json({failureReason: reason});
  }
};

Add the following configuration:

```js
auth: {
      jwsSecret:'', 
      algo: 'HS256',
      aaf: {
        login_url:'' 
      }
```