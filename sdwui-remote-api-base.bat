@echo off
python ./dotenv.py
./webui.bat --listen --port=5421 --skip-version-check --skip-python-version-check --skip-torch-cuda-test --skip-prepare-environment --skip-install --ngrok --ckpt=models/Stable-diffusion/FullPictos274.safetensors