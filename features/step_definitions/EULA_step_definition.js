module.exports = function () {

  this.When(/^"([^"]*)" signs in with password "([^"]*)"$/, {timeout: 100 * 1000}, function (arg1, arg2, callback) {  
     this.call('C:\\Workspace\\Cheetah\\PathologistPortal\\FMI.Cheetah.Automation\\Web\\FMI-PathologyPortal-Suite.pjs',
      'FMI-PathologyPortal-Project',
      'EULA_Verifications.stepEulaSignIn(' + arg1 + ',' + arg2 +')',
      callback);
  });

  this.Then(/^page with "([^"]*)" as title is displayed$/, {timeout: 100 * 1000}, function (arg1,callback) {
     this.call('C:\\Workspace\\Cheetah\\PathologistPortal\\FMI.Cheetah.Automation\\Web\\FMI-PathologyPortal-Suite.pjs',
      'FMI-PathologyPortal-Project',
      'EULA_Verifications.testInEulaDocument()',
      callback);
  });

  this.When(/^TestEula clicks on accept button$/, {timeout: 100 * 1000}, function (callback) {
     this.call('C:\\Workspace\\Cheetah\\PathologistPortal\\FMI.Cheetah.Automation\\Web\\FMI-PathologyPortal-Suite.pjs',
      'FMI-PathologyPortal-Project',
      'EULA_Verifications.testClickAcceptBtn()',
      callback);
  });

  this.Then(/^Worklist page is displayed$/, {timeout: 100 * 1000}, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
};
