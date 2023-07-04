@echo off
where git
if %errorlevel% neq 0 (
    echo "Git not found in PATH, continuing without git version check"
)
where python
if %errorlevel% neq 0 (
    echo "Python not found in PATH"
    exit /b 1
)
where pip
if %errorlevel% neq 0 (
    echo "Python not found in PATH"
    exit /b 1
)
git pull
./webui.bat --listen --port=5421 --ckpt=models/Stable-diffusion/FullPictos274.safetensors