@echo off
echo This script attempts to open GameFrameworkTS.html
echo within a Chrome (or Chromium) browser
echo running the --allow-file-access-from-files switch,
echo which is necessary to access content files
echo when running from file, rather than a web server. 
echo This won't work if:
echo 1. Chrome is not installed,
echo 2. Chrome's path is not part of the "PATH" environment variable, or
echo 3. any Chrome window is already running without the "--allow-file-access-from-files" switch.

cd ..
chrome --allow-file-access-from-files %cd%/GameFrameworkTS.html