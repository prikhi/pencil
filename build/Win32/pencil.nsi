; Pencil Launcher
;--------------
!include FileFunc.nsh

Name "Pencil"
Caption "Pencil"
Icon "app\icons\default\main-window.ico"
OutFile "pencil.exe"

RequestExecutionLevel user
SilentInstall silent
AutoCloseWindow true
ShowInstDetails nevershow

Section ""
    StrCpy $0 '"$EXEDIR\xulrunner\xulrunner.exe" "$EXEDIR\app\application.ini"'
    ${GetParameters} $R0
    Exec "$0 $R0"
SectionEnd
