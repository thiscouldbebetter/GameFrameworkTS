#! /bin/sh

echo Script begins.

echo Deleting any existing _BuildErrors.txt.
rm _BuildErrors.txt

echo About to start writing _BuildRecord.ts...

echo // Generated by the _Build.bat or .sh scripts. > _BuildRecord.ts

echo class _BuildRecord >> _BuildRecord.ts
echo { >> _BuildRecord.ts

echo Getting current date in UTC.
now=`date --iso-8601=s --universal`
nowYear=`echo $now | cut -c 1-4`
nowMonth=`echo $now | cut -c 6-7`
nowDay=`echo $now | cut -c 9-10`
nowHour=`echo $now | cut -c 12-13`
nowMinute=`echo $now | cut -c 15-16`
nowSecond=`echo $now | cut -c 18-19`

echo About to write .buildTime\(\) to _BuildRecord.ts...
#The parsing in the next line is because leading zeroes are disallowed in TypeScript, because they're interpreted as octals, which are deprecated!
echo \\tstatic buildTime\(\): Date { return new Date\($nowYear, \(parseInt\(\"$nowMonth\"\) - 1\), parseInt\(\"$nowDay\"\), parseInt\(\"$nowHour\"\), parseInt\(\"$nowMinute\"\), parseInt\(\"$nowSecond\"\) \)\; } >> _BuildRecord.ts
echo ...done writing .buildTime\(\) to _BuildRecord.ts.

echo Attempting to get version from Git tags \(if none, will use \"unknown\"\)...
#Reads the current version from git tags, or, if none available, uses "unknown".
version=`git describe --tags`
if [ "$version" = "" ]
then
	version=unknown
fi
echo ...done attempting to get version from Git tags.

echo About to write .version\(\) to _BuildRecord.ts...
echo \\tstatic version\(\): string \{ return \"$version\"\; } >> _BuildRecord.ts
echo } >> _BuildRecord.ts
echo ...done writing .version\(\) to _BuildRecord.ts.

echo ...done writing _BuildRecord.ts.

echo About to transpile TypeScript using tsc \(this may take a while on slower systems\)...
tsc > _BuildErrors.txt
echo ...done transpiling.

echo Displaying build errors, if any:
cat _BuildErrors.txt

echo ""

echo Script ends.
