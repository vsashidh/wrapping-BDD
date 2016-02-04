// --------------------------------------------------
//
// Usage:
// ATR.js Parameters
//
// Parameters:
// 1.Required: TestComplete | TestExecute  (the tool to be launched)
// 2.Required: ProjectSuite fullpath | Project fullpath  (the project suite/project to be run)
// 3.Required: Export log path
// 4.Required: /p:<projectname>  (the project to be run, if running a project suite )
// 5.Required: /t:<project test item>  (the project test item to be executed)
// 6.Optional: /silentmode  (run the test in silent mode)
// 7.Optional: /e  (exit after the execution is completed)
//
// --------------------------------------------------

var AppObject; // a TestComplete or TestExecute instance
var Integration; // The integration object of the AppObject object
var IntegrationResultDescription; //last run test result
var ProjectName; // The name of the project to be run
var TestItemName; // The project test item to be run.
var ScriptName; // The script name to be run.
var ExportLog; //Export log path

var Params = WScript.Arguments; // Command-line parameters
var ToolToRun = Params(0); // The name of the tool to be run ("TestComplete" of "TestExecute")
var ProjectFullPath = Params(1); // The project / project suite's full path
var FirstKeyIndex = 2; // The index of the first key in parameters



function Stop(message) // Stops the test execution with the "message" error message
{
  WScript.Echo(message);
  WScript.Quit(1); 
}


function CreateNewInstance(ObjectName) // Creates a new instance of the "ObjectName" object
{
  try {
    AppObject = new ActiveXObject(ObjectName);
    return true;
  }
  catch(e) {
    return false;
  }  
}

function CheckForInstance(ObjectName) // Checks whether an instance of the "ObjectName" object exists
{
  try {
    AppObject = GetObject("", ObjectName);
    return true;
  } 
  catch(e) {
    return false;
  }
}

function GetCOMObject() // Obtains the TC or TE object if it exists (or creates if it does not exist) 
{
  var TC = CheckForInstance("TestComplete.TestCompleteApplication");
  var TE = CheckForInstance("TestExecute.TestExecuteApplication");
  
  if (ToolToRun.indexOf("TestComplete") > -1)  { // We need to run TestComplete
    if (true == TE) {
      Stop("TestExecute is already running. Exiting....");
    }  
    else {
      if (true == TC) return true;
      if (true == CreateNewInstance("TestComplete.TestCompleteApplication")) return true;
      Stop("Cannot start TestComplete. Exiting....");
    }  
  }
  else { // We need to run TestExecute
    if (true == TC)  {
      Stop("TestComplete is already running. Exiting....");
    }
    else {
      if (true == TE) return true;  
      if (true == CreateNewInstance("TestExecute.TestExecuteApplication")) return true;
      Stop("Cannot start TestExecute. Exiting....");
    }
  }
  
  return false;
}

function isKeyInParams(key) // Checks whether the "key" key is in command-line parameters
{
  for (var i = FirstKeyIndex; i < Params.length; i++) {
    if (Params(i).toLowerCase().indexOf(key.toLowerCase()) > -1)
      return true;
  }
  return false;
}

function GetKeyValueFromParams(key) // Gets the value of the "key" key from command-line parameters
{
  for (var i = FirstKeyIndex; i < Params.length; i++) {
    if (Params(i).toLowerCase().indexOf(key.toLowerCase()) > -1) {
        var arr = Params(i).split(":");
        var returnStr = "";
        for (var i = 1; i < arr.length; i++) {
            if ((i + 1) == arr.length)
                returnStr += arr[i];
            else
            returnStr += arr[i] + ":";
        }
        return returnStr;
    }
  }
  return "";
}

function GetProjectName()  // Gets the project name
{  
  // Checks whether we run the project
  var ifRunningAProject = ProjectFullPath.substring(ProjectFullPath.lastIndexOf("."), ProjectFullPath.length).indexOf("mds") > 0;
  if (true == ifRunningAProject) {
	// If we run the project, extracts the name of the project from the command line
    return ProjectFullPath.substring(ProjectFullPath.lastIndexOf("\\"), ProjectFullPath.lastIndexOf("."));
  }
  // If we run the project suite, extracts the project name from the "/p" key
  return GetKeyValueFromParams("/p");    
}

function ConvertJScriptArray(JScriptArray) //Converts a JScript array into variant arrays.
{
  // Uses the Dictionary object to convert a JScript array
  //var objDict = Sys.OleObject("Scripting.Dictionary");
  var objDict = new ActiveXObject("Scripting.Dictionary");
  objDict.RemoveAll();
  for (var i in JScriptArray)
    objDict.Add(i, JScriptArray[i]);
  return objDict.Items();
}

// The main code


// If there are less than 2 parameters in the command line, stops the script execution
if (Params.length < FirstKeyIndex) {  
  Stop("Not enough parameters. Exiting...");
}

// Obtains the project name
ProjectName = GetProjectName();
  
// If the project name is not specified, stops the script execution
if (ProjectName == "") {
  Stop("Project Is Not Specified. Exiting...");
}

// Obtains the COM object of TC or TE
GetCOMObject();

// Runs the test in silent mode or in normal mode
if (false == isKeyInParams("/silentmode")) {
  AppObject.Manager.RunMode = 0;
  AppObject.Visible = true;
}
else {
  AppObject.Manager.RunMode = 3;
}

// Obtains the Integration object of TC or TE
Integration = AppObject.Integration;

// Is TE or TC executing a test? If it is, stops the test execution
if (Integration.IsRunning()){
  WScript.Echo("The test is already running. Stop it manually or click 'OK' to force the test to be terminated.");
  Integration.Stop();
  while (AppObject.Integration.IsRunning()) {
    WScript.Sleep(100);
  }
}

// Opens the project (project suite)
var projectSuiteFullPath = Params(1);
if (false == Integration.OpenProjectSuite(projectSuiteFullPath)) {
  AppObject.Quit();
  Stop("Cannot open the project (project suite). Please check the path.");
} 

// What project test item do we need to run?
TestItemName = GetKeyValueFromParams("/t");

// What project test item do we need to run?
ScriptName = GetKeyValueFromParams("/s");

// If the project test item is specified, runs it. Otherwise, runs the whole project
if ( TestItemName != "")
    AppObject.Integration.RunProjectTestItem(ProjectName, TestItemName);
else if (ScriptName != "") {
    arr = ScriptName.split(/[.()]/);
    var unitName = arr[0];
    var routineName = arr[1];
    if (arr[2] != null) {
        paramArray = ConvertJScriptArray(arr[2].split(","));
    }
    else {
        var paramArray = ConvertJScriptArray([]);
    }
    AppObject.Integration.RunRoutineEx(ProjectName, unitName, routineName, paramArray);
}
else
    AppObject.Integration.RunProject(ProjectName);
  
// Waits until the test is over
while (AppObject.Integration.IsRunning()) {
  WScript.Sleep(500);
}

//Export log
ExportLog = GetKeyValueFromParams("/ExportLog");
if( ExportLog != "")
    Integration.ExportResults(ExportLog, false);

//Printing to standout results of the last run
if (WScript.Fullname.toUpperCase().indexOf("CSCRIPT",0) > -1) {
    IntegrationResultDescription = Integration.GetLastResultDescription();
    if (IntegrationResultDescription.Status === 0 || IntegrationResultDescription.Status === 1) {
        WScript.StdOut.Write('{"TestResult": "Pass"}');
    }else {
        WScript.StdOut.Write('{"TestResult": "Fail"}');
    }
}
// If there is the /e key, terminates TC or TE
if (isKeyInParams("/e")) {
  AppObject.Quit();
}

