@echo off

del _BuildErrors.txt
del _BuildRecord.ts

rem The parsing in the next line is because leading zeroes are disallowed in TypeScript, because they're interpreted as octals, which are deprecated!
echo class _BuildRecord { static buildTime(): Date { return new Date(%date:~10,4%, (%date:~4,2% - 1), %date:~7,2%, %time:~0,2%, parseInt("%time:~3,2%"), parseInt("%time:~6,2%")); } } > _BuildRecord.ts

tsc > _BuildErrors.txt

rem Can't do anything after tsc because tsc forces the script to end immediately!
