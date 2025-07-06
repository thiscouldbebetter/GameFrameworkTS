rem Clone the main repo, copy the Stub directory out of it, and delete it.
git clone https://github.com/thiscouldbebetter/GameFrameworkTS
mkdir Stub
cd Stub
xcopy /S /Q ..\GameFrameworkTS\Stub\
cd ..
rmdir /S /Q GameFrameworkTS

cd Stub
git init
cd Source
git submodule add https://github.com/thiscouldbebetter/GameFrameworkTS Framework

rem Get sbmodules of the Framework submodule.  There's got to be a better way!
cd Framework/Source/
cd Media/Audio/MusicTracker
git submodule init
cd ../../..
git pull --recurse-submodules
cd ../..

rem Copy build and run scripts from Framework.
mkdir _Scripts
cd _Scripts
xcopy /S /Q ..\Framework\Source\_Scripts\
cd ..

rem Delete the scripts we no longer need.
del *.sh *.bat

