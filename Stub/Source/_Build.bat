@echo off

del _BuildErrors.txt

echo // Generated by the _Build.bat or .sh scripts. > _BuildRecord.ts

echo class _BuildRecord >> _BuildRecord.ts
echo { >> _BuildRecord.ts

rem The parsing in the next line is because leading zeroes are disallowed in TypeScript, because they're interpreted as octals, which are deprecated!
rem Also, please note that the start indices for the date and time substrings may need to be adjusted according to the date format settings on the host machine.
rem Finally, some systems may convert the %tab% instances to "\t", rather than a tab character.  It may be better to simply remove them in that case.
echo %tab%static buildTime(): Date { return new Date(%date:~0,4%, (%date:~5,2% - 1), %date:~8,2%, %time:~0,2%, parseInt("%time:~3,2%"), parseInt("%time:~6,2%")); } >> _BuildRecord.ts

rem Reads the current version from git tags, or, if none available, uses "unknown".
set version=
for /F "tokens=*" %%g in ('git describe --tags') do (set version=%%g)
if [%version%] == [] ( set version=unknown)
echo %tab%static version(): string { return "%version%"; } >> _BuildRecord.ts

echo } >> _BuildRecord.ts

tsc > _BuildErrors.txt

rem Can't do anything after tsc because tsc forces the script to end immediately!
