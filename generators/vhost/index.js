'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({

  configuring: function() {
    var config;
    config = this.config.get( 'env' ) || {};
    var devConfig = config.dev || {};
    this.devDomain = devConfig.domain || false;
  },

  writing: {

    // write config in your MAMP vhost file
    vhostConfig: function() {
      var self, done, domain;
      self = this;
      domain = this.devDomain;

      if ( ! domain ) {
        this.log.error("No dev domain set");
        return;
      }

      done = this.async();
      this.log.info('doing vhost ...');

      this.fs.copyTpl(
        this.templatePath('vhost'),
        this.destinationPath('.vhost'),
        {
          path: this.destinationPath(),
          domain: domain
        }
  	  );
      done();
    }
  }
});
