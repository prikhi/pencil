;NSIS Modern User Interface
;Setup Script for Pencil win32, private xulrunner
;Written by Bui Pham Minh Tri
;Modified by Duong Thanh An

;--------------------------------
;Include Modern UI

  !include "MUI2.nsh"
  !include WordFunc.nsh
  !include LogicLib.nsh

;--------------------------------
;General
  !define LANG_ENGLISH 1033
  !define MUI_ICON "app\icons\default\main-window.ico"

  !define MUI_HEADERIMAGE
  !define MUI_HEADERIMAGE_BITMAP "mui-header.bmp"

  !define MUI_WELCOMEFINISHPAGE_BITMAP "mui-welcome.bmp"

  !define PRODUCT_NAME "@NAME@"
  !define PRODUCT_VERSION "@VERSION@.@BUILD@.0"
  !define PRODUCT_DESCRIPTION "Pencil GUI Prototyping Tool"
  !define COMPANY_NAME "Evolus"
  !define COMPANY_FULLNAME "Evolus Co., Ltd."
  !define COMPANY_WEBSITE "http://www.evolus.vn/Pencil"
  !define PRODUCT_EXECUTE_FILE "pencil.exe"
  !define PRODUCT_REGKEY "Software\${COMPANY_NAME}\${PRODUCT_NAME}"

  ;Name and file
  Name "${COMPANY_NAME} ${PRODUCT_NAME}"
  OutFile "..\Pencil-@VERSION@-win32.installer.exe"

  VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName" "${PRODUCT_NAME}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "Comments" "${PRODUCT_DESCRIPTION}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName" "${COMPANY_FULLNAME}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalTrademarks" "${PRODUCT_NAME} Application is a trademark of ${COMPANY_FULLNAME}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright" "© ${COMPANY_FULLNAME}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription" "${PRODUCT_DESCRIPTION}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion" "${PRODUCT_VERSION}"

  VIProductVersion "${PRODUCT_VERSION}"

  ;Default installation folder
  InstallDir "$PROGRAMFILES\${COMPANY_NAME}\${PRODUCT_NAME}"

  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "${PRODUCT_REGKEY}" ""

;--------------------------------
;Variables

  Var MUI_TEMP
  Var STARTMENU_FOLDER

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING

;--------------------------------
;Pages

  !insertmacro MUI_PAGE_LICENSE "app\license.txt"
;  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_DIRECTORY

  ;Start Menu Folder Page Configuration
  !define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
  !define MUI_STARTMENUPAGE_REGISTRY_KEY "${PRODUCT_REGKEY}"
  !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"
  !define MUI_STARTMENUPAGE_DEFAULTFOLDER "${COMPANY_NAME}\${PRODUCT_NAME}"

  !insertmacro MUI_PAGE_STARTMENU Application $STARTMENU_FOLDER

  !insertmacro MUI_PAGE_INSTFILES

  !ifdef README_FILE
	!define MUI_FINISHPAGE_SHOWREADME "$PROGRAMFILES\${COMPANY_NAME}\${PRODUCT_NAME}\${README_FILE}"
	!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show Readme"
  !endif

  !define MUI_FINISHPAGE_RUN "$PROGRAMFILES\${COMPANY_NAME}\${PRODUCT_NAME}\${PRODUCT_EXECUTE_FILE}"
  !define MUI_FINISHPAGE_RUN_TEXT "Launch ${PRODUCT_NAME}"

  !insertmacro MUI_PAGE_FINISH

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  !insertmacro MUI_UNPAGE_FINISH

;--------------------------------
;Languages

  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section "Main Section" SecMain

    SetOutPath "$INSTDIR"
    File /r "app"
    File "${PRODUCT_EXECUTE_FILE}"

    SetOutPath "$INSTDIR"
    File /r "xulrunner"

    !ifdef README_FILE
    File "doc\${README_FILE}"
    !endif

    ;Store installation folder
    WriteRegStr HKCU "${PRODUCT_REGKEY}" "" $INSTDIR

    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${COMPANY_FULLNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "HelpLink" "${COMPANY_WEBSITE}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion " "${PRODUCT_VERSION}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"

    ;Create uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"

    !insertmacro MUI_STARTMENU_WRITE_BEGIN Application

    ;Create shortcuts
    CreateDirectory "$SMPROGRAMS\$STARTMENU_FOLDER"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_EXECUTE_FILE}"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall.lnk" "$INSTDIR\Uninstall.exe"

    CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${PRODUCT_EXECUTE_FILE}"

    ;Associate .ep files
    WriteRegStr HKLM "Software\Classes\.ep" "" "Pencil"
    WriteRegStr HKLM "Software\Classes\Pencil" "" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Classes\Pencil\DefaultIcon" "" '"$INSTDIR\app\icons\default\main-window.ico"'
    WriteRegStr HKLM "Software\Classes\Pencil\shell\open\command" "" '"$INSTDIR\${PRODUCT_EXECUTE_FILE}" "%1"'

    !ifdef README_FILE
      CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\Readme.lnk" "$INSTDIR\${README_FILE}"
    !endif

    !insertmacro MUI_STARTMENU_WRITE_END

SectionEnd

;--------------------------------
;Descriptions

  ;Language strings
  LangString DESC_SecMain ${LANG_ENGLISH} "Main section."

  ;Assign language strings to sections
  ;!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  ;  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
  ;!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
;Uninstaller Section

Section "Uninstall"

  ;DELETE YOUR OWN FILES HERE...

  RMDir /r "$INSTDIR"

  !insertmacro MUI_STARTMENU_GETFOLDER Application $MUI_TEMP

  Delete "$SMPROGRAMS\$MUI_TEMP\Uninstall.lnk"
  Delete "$SMPROGRAMS\$MUI_TEMP\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\Startup\${PRODUCT_NAME}.lnk"
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"

  !ifdef README_FILE
    Delete "$SMPROGRAMS\$MUI_TEMP\Readme.lnk"
  !endif

  ;Delete empty start menu parent diretories
  StrCpy $MUI_TEMP "$SMPROGRAMS\$MUI_TEMP"

  startMenuDeleteLoop:
	ClearErrors
    RMDir $MUI_TEMP
    GetFullPathName $MUI_TEMP "$MUI_TEMP\.."

    IfErrors startMenuDeleteLoopDone

    StrCmp $MUI_TEMP $SMPROGRAMS startMenuDeleteLoopDone startMenuDeleteLoop
  startMenuDeleteLoopDone:

  DeleteRegKey /ifempty HKCU "${PRODUCT_REGKEY}"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"

  ;Remove File Associations
  DeleteRegKey HKLM "Software\Classes\.ep"
  DeleteRegKey HKLM "Software\Classes\Pencil"

SectionEnd
