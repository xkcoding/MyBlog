@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\titlecase\bin.js" %*
) ELSE (
  node  "%~dp0\..\titlecase\bin.js" %*
)