#!/bin/sh

# This won't work if:
# 1. Chrome is not installed,
# 2. Chrome's path is not part of the "PATH" environment variable, or
# 3. any Chrome window is already running without the "--allow-file-access-from-files" switch.

chrome --allow-file-access-from-files