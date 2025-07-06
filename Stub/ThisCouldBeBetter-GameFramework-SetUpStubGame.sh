#!/bin/sh

# Clone the main repo, copy the Stub directory out of it, and delete it.
git clone https://github.com/thiscouldbebetter/GameFrameworkTS
mkdir Stub
cd Stub
# todo - Copied some commands from Windows script and never tested.
cp ..\GameFrameworkTS\Stub\ .
cd ..
rm -rf GameFrameworkTS
cd Stub
git init
cd Source
git submodule add https://github.com/thiscouldbebetter/GameFrameworkTS Framework

#Get sbmodules of the Framework submodule.  There's got to be a better way!
cd Framework/Source/
cd Media/Audio/MusicTracker
git submodule init
cd ../../..
git pull --recurse-submodules
cd ../..

# Delete the scripts we no longer need.
rm *.sh *.bat
