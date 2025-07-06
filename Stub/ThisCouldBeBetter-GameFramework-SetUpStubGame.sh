#!/bin/sh
git clone https://github.com/thiscouldbebetter/GameFrameworkTS
mkdir Stub
cd Stub
# todo - Copied this from Windows script and never tested.
cp ..\GameFrameworkTS\Stub\ .
cd ..
rm -rf GameFrameworkTS
cd Stub
git init
cd Source
git submodule add https://github.com/thiscouldbebetter/GameFrameworkTS Framework
