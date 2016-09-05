@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\window-size\cli.js" %*
) ELSE (
  node  "%~dp0\..\window-size\cli.js" %*
)