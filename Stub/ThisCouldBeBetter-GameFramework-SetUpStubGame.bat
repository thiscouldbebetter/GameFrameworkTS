@echo off

echo Script begins.

echo About to clone the GameFrameworkTS repository...
git clone https://github.com/thiscouldbebetter/GameFrameworkTS
echo ...done cloning.

echo About to create and enter the 'Stub' directory...
mkdir Stub
cd Stub
echo ...done.

echo About to copy the contents of the 'Stub' directory from the framework...
xcopy /S /Q ..\GameFrameworkTS\Stub\
echo ...done.

echo About to return to parent directory and delete the framework...
cd ..
rmdir /S /Q GameFrameworkTS
echo ...done.

echo About to enter the Stub directory, make it a Git repo, and add Framework as a submodule...
cd Stub
git init
cd Source
git submodule add https://github.com/thiscouldbebetter/GameFrameworkTS Framework
git submodule update --init --recursive .
echo ...done.

echo About to copy build and run scripts from the framework to '_Scripts'...
mkdir _Scripts
cd _Scripts
xcopy /S /Q ..\Framework\Source\_Scripts\
cd ..
echo ...done.

echo About to delete the 'create stub' scripts...
del *.sh *.bat
echo ...done.

echo Script ends.
