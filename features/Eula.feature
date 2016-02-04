#

Feature: EULA item
	As a new user named TestEula of Product
	TestEula should be given the chance to review the End user license agreement(EULA)

	Scenario: New user named TestEula signs in
		When "TestEula" signs in with password "password"
		Then page with "EULA" as title is displayed

	Scenario: New user accepts the EULA document
		When "TestEula" signs in with password "P@ssw0rd"
		And TestEula clicks on accept button
		Then Worklist page is displayed