@echo off
echo "If 'ngrok not found' error, please install ngrok on venv or run 'webui.bat --ngrok=none' once so that the command installs it properly"
./webui.bat --listen --port=5421 --skip-version-check --skip-python-version-check --skip-torch-cuda-test --skip-prepare-environment --skip-install --ngrok=none --ckpt=models/Stable-diffusion/FullPictos274.safetensors