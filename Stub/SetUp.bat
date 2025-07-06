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
