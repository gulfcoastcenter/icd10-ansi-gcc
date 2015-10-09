var util = require('mis-util');
var config = require('./config.ignore');

var options = {
   sysname: config.sysname,
   connect: {
      host: config.host,
      user: config.name,
      password: config.user
   },
   cron: {
      user: config.cronname,
      pass: config.cron
   },
   view_path: {
      local: './view/',
      remote: '/CUST/forms/'
   },
   parm_path: {
      local: './build/'
   },
   usc_extenion: 'usc',
   usc_path: {
      local: './usc/'
   }
};

var mis = util(options);

mis.parm.fromflatfile('parm/icd10isn.parm')
.then(mis.parm.tofile.bind(mis, 'build/ICD10ISN.parm'))
.then(mis.parm.fromflatfile.bind(mis, 'parm/ansiwrap.parm'))
.then(mis.parm.tofile.bind(mis, 'build/ANSIWRAP.parm'))
.then(mis.deploy.parm)
.then(mis.deploy.usc.bind(mis,false))
.then(function(scripts) { 
   mis.script.installcompile()
   .then(function() {
     return mis.script.compile(
         scripts.filter(function(script) { return script.indexOf('inc_') < 0 }));
   })
   .then(mis.script.uninstallcompile);
});
