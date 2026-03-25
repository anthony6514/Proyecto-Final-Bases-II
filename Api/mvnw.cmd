@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM
@REM Optional ENV vars
@REM   JAVA_HOME - location of a JDK home dir
@REM   MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM   MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM   MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@setlocal

@set DIRNAME=%~dp0
@if "%DIRNAME%" == "" set DIRNAME=.\

@set APP_BASE_NAME=%~n0
@set APP_HOME=%DIRNAME%

@REM Resolve any "." and ".." in APP_HOME to make it shorter.
@for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@REM Execute a user defined script before this one
@if not "%MAVEN_SKIP_RC%" == "" goto skipArgs
@if exist "%USERPROFILE%\mavenrc_pre.bat" call "%USERPROFILE%\mavenrc_pre.bat"
@if exist "%USERPROFILE%\mavenrc_pre.cmd" call "%USERPROFILE%\mavenrc_pre.cmd"
:skipArgs

@REM Find java.exe
@if not "%JAVA_HOME%" == "" goto gotJdkHome
@for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
@goto checkJava

:gotJdkHome
@set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:checkJava
@if exist "%JAVACMD%" goto init

@echo.
@echo ERROR: JAVA_HOME is set to an invalid directory.
@echo ERROR: Please set the JAVA_HOME variable in your environment to match the
@echo ERROR: location of your Java installation.
@echo.
@goto error

:init

@set MAVEN_JAR=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar
@set MAVEN_PROPERTIES=%APP_HOME%\.mvn\wrapper\maven-wrapper.properties
@set MAVEN_CLASS=org.apache.maven.wrapper.MavenWrapperMain

@REM --- Use Powershell to download the jar if it's missing ---
@if exist "%MAVEN_JAR%" goto run
@if not exist "%APP_HOME%\.mvn\wrapper" mkdir "%APP_HOME%\.mvn\wrapper"
@echo Downloading Maven Wrapper...
@powershell -Command "&{"^
		"$webclient = New-Object System.Net.WebClient;"^
		"$url = [System.IO.File]::ReadAllLines('%MAVEN_PROPERTIES%') | Select-String 'wrapperUrl=' | ForEach-Object { $_.ToString().Split('=')[1] };"^
		"$webclient.DownloadFile($url, '%MAVEN_JAR%');"^
		"}"

:run
@set CLASSPATH=%MAVEN_JAR%
"%JAVACMD%" %MAVEN_OPTS% -classpath "%CLASSPATH%" %MAVEN_CLASS% %*

@if ERRORLEVEL 1 goto error
@goto end

:error
@set ERROR_CODE=1

:end
@if "%MAVEN_BATCH_PAUSE%" == "on" pause

@if "%MAVEN_SKIP_RC%" == "" @if exist "%USERPROFILE%\mavenrc_post.bat" call "%USERPROFILE%\mavenrc_post.bat"
@if "%MAVEN_SKIP_RC%" == "" @if exist "%USERPROFILE%\mavenrc_post.cmd" call "%USERPROFILE%\mavenrc_post.cmd"

@exit /B %ERROR_CODE%
