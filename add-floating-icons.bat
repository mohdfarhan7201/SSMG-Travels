@echo off
setlocal enabledelayedexpansion

echo Adding floating icons to all HTML files...

for %%f in (*.html) do (
    echo Processing %%f...
    
    REM Check if file already has floating-icons.css
    findstr /c:"floating-icons.css" "%%f" >nul
    if !errorlevel! neq 0 (
        REM Add CSS link after style.css
        powershell -Command "(Get-Content '%%f') -replace '    <link rel=\"stylesheet\" href=\"assets/css/style.css\" />', '    <link rel=\"stylesheet\" href=\"assets/css/style.css\" />`r`n    <!-- Floating Icons CSS -->`r`n    <link rel=\"stylesheet\" href=\"floating-icons.css\" />' | Set-Content '%%f'"
    )
    
    REM Check if file already has WhatsApp button
    findstr /c:"whatsapp-float" "%%f" >nul
    if !errorlevel! neq 0 (
        REM Add WhatsApp button before scrollToTop
        powershell -Command "(Get-Content '%%f') -replace '    <a href=\"#\" class=\"scrollToTop scroll-btn\"', '    <!-- WhatsApp Floating Button -->`r`n    <a href=\"https://wa.me/917380708008\" class=\"whatsapp-float\" target=\"_blank\">`r`n        <i class=\"fab fa-whatsapp\"></i>`r`n    </a>`r`n    `r`n    <a href=\"#\" class=\"scrollToTop scroll-btn\"' | Set-Content '%%f'"
    )
)

echo Done! All HTML files have been updated with floating icons.
pause