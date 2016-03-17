'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('underscore');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the praiseworthy ' + chalk.red('generator-angular-symfony') + ' generator!'
    ));

    var prompts = [
    {
      type: 'list',
      name: 'symfonyVersion',
      message: 'Which symfony version?',
      choices: [
        {
          value: null,
          name: 'latest',
        },
        {
          value: '3.0',
          name: '3.0',
        },
        {
          value: '2.8',
          name: '2.8',
        }
      ]
    },
    {
      type: 'text',
      name: 'projectName',
      message: 'The name of this project ?',
      default : 'MyProject'
    },
    {
      type: 'text',
      name: 'templateFolder',
      message: 'Where should I install the frontend ?',
      default : '_template'
    },
    {
      type: 'text',
      name: 'frontendAppname',
      message: 'What is the name of your angular app ?',
      default : 'frontend'
    },
    {
      type: 'text',
      name: 'sfViews',
      message: 'Symfony views?',
      default : 'src/AppBundle/Resources/views/App/'
    },
    {
      type: 'text',
      name: 'sfAssets',
      message: 'Symfony assets?',
      default : 'web/'
    },
    {
      type: 'text',
      name: 'sfTwigIndexLogicalName',
      message: 'Twix index file logical name ?',
      default : 'AppBundle:App:index.html.twig'
    },
    {
      type: 'text',
      name: 'devDomain',
      message: 'What is your dev domain?',
      default : 'app.loc'
    }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  'initializing' : function () {

  },
  configuring: function() {
    this.log.info('save config.');
    var env = {
      dev: {
        domain: this.props.devDomain
      }
    }
    this.config.set('projectName', this.props.projectName  );
    this.config.set('templateFolder', this.props.templateFolder  );
    this.config.set('frontendAppname', this.props.frontendAppname  );
    this.config.set('sfViews', this.props.sfViews  );
    this.config.set('sfAssets', this.props.sfAssets  );
    this.config.set('sfTwigIndexLogicalName', this.props.sfTwigIndexLogicalName  );
    this.config.set('env', env  );

  },

  writing: function () {



    // DEV
    //return;




    var self = this;
    var done = this.async();
    var destinationRoot = this.destinationRoot();
    var frontendDestinationRoot = this.props.templateFolder + '/';
    var props = this.props;

    this.log.info('install symfony');
    this.log.info(this.props);

    var symfonyArgs =[
      'new',
      destinationRoot
    ];
    if(this.props.symfonyVersion) {
      symfonyArgs.push(this.props.symfonyVersion)
    }

    // install symfony
    this.spawnCommandSync('symfony', symfonyArgs);
    this.log.info('symfony installed.');

    // install frontend
    this.spawnCommandSync('mkdir', [props.templateFolder]);
    this.destinationRoot(frontendDestinationRoot);
    this.spawnCommandSync('yo', ['angular', props.frontendAppname ]);
    this.log.info('angular app installed.');
    this.destinationRoot(destinationRoot);

    done();

  },

  install: {

    installFromComposerTemplate: function() {


      // DEV
      //return;



      var self = this;
      // get tepmlate config
      fs.readFile(self.templatePath('composer.json'), 'utf8', function (err,data) {
        var composer = JSON.parse(data);
        _.each( composer.require, function(value, key, list){
          self.spawnCommand('composer', ['require', key + ':' + value, '--ignore-platform-reqs' ]);
        });
        self.log.info('composer requirements from template added.');
      });
    },
    vhost: function() {
      // subgenerator
      this.composeWith('angular-symfony:vhost');
    },
    gruntfile: function() {
      // simply copy a file with no templateing
      fs.createReadStream(this.templatePath('Gruntfile.js')).pipe(fs.createWriteStream(this.destinationPath('Gruntfile.js')));
    },
    packagefile: function() {

      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          name: this.config.get( 'projectName' ),
          templateFolder: this.config.get( 'templateFolder' )

        }
  	  );

    },
    gitignore: function() {
      var self = this;
      self.log.info('read gitignore');
  	  fs.readFile(this.templatePath('gitignore.txt'), 'utf8', function (err,data) {
    	  /// no error handling yet
        self.log.info(data);
        if (data !== undefined ) {
          fs.appendFile(self.destinationPath('.gitignore'), data, function (err) {
          // no error handling yet
          });
        }
      });
    },
    defaultController: function() {

      this.fs.copyTpl(
        this.templatePath('DefaultController.php'),
        this.destinationPath('src/AppBundle/Controller/DefaultController.php'),
        {
          indexLogicalName: this.config.get( 'sfTwigIndexLogicalName' )
        }
  	  );
    },
    other: function() {
      this.installDependencies();
    }
  }
});
