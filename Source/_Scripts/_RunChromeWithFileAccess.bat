@echo off

echo Attempting to start the Chrome (or Chromium) browser with the --allow-file-access-from-files switch.
echo This won't work if:
echo 1. Chrome is not installed,
echo 2. Chrome's path is not part of the "PATH" environment variable, or
echo 3. any Chrome window is already running without the "--allow-file-access-from-files" switch.

chrome --allow-file-access-from-files