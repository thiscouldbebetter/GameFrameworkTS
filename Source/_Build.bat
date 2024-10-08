@echo off

del _BuildErrors.txt

echo // Generated by the _Build.bat or .sh scripts. > _BuildRecord.ts

echo class _BuildRecord >> _BuildRecord.ts
echo { >> _BuildRecord.ts

rem %tab% seems to now be sending the control sequence "\t"
rem rather than an actual tab, so the formatting has been removed for now.

rem The parsing in the next line is because
rem leading zeroes are disallowed in TypeScript,
rem because they're interpreted as octals, which are deprecated!
rem Also, parsing may fail if the date formatting has been changed from the default.

rem I don't remember why this next line had to change, then change back.
rem Perhaps different versions of Windows
rem format the string returned by the "date" and "time" command differently?

rem echo static buildTime(): Date { return new Date(%date:~10,4%, (parseInt("%date:~4,2%") - 1), parseInt("%date:~7,2%"), parseInt("%time:~0,2%"), parseInt("%time:~3,2%"), parseInt("%time:~6,2%")); } >> _BuildRecord.ts
echo static buildTime(): Date { return new Date(%date:~0,4%, (parseInt("%date:~5,2%") - 1), parseInt("%date:~8,2%"), parseInt("%time:~0,2%"), parseInt("%time:~3,2%"), parseInt("%time:~6,2%")); } >> _BuildRecord.ts

rem Reads the current version from git tags, or, if none available, uses "unknown".
set version=
for /F "tokens=*" %%g in ('git describe --tags') do (set version=%%g)
if [%version%] == [] ( set version=unknown)
echo static version(): string { return "%version%"; } >> _BuildRecord.ts

echo } >> _BuildRecord.ts

tsc > _BuildErrors.txt

rem Can't do anything after tsc because tsc forces the script to end immediately!
