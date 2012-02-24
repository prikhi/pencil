; Pencil Launcher
;--------------

Name "Pencil"
Caption "Pencil"
Icon "app\icons\default\main-window.ico"
OutFile "pencil.exe"

RequestExecutionLevel user
SilentInstall silent
AutoCloseWindow true
ShowInstDetails nevershow

Section ""
    StrCpy $0 '"$EXEDIR\xulrunner\xulrunner.exe" --app "$EXEDIR\app\application.ini"'
    Exec $0
SectionEnd
