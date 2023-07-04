import ngrok
import os
from dotenv import load_dotenv

# Connect to ngrok for ingress
def connect(token, port, options):
    
    if int(os.environ.get('NGROK_UP', '0')): # If ngrok is already up, don't do anything
        print('ngrok is already up, skipping...')
        return
    # Read env file, it might fail bc of multithreading,
    # in which case load the .env data into the environment manually
    load_dotenv() 
    # For all options see: https://github.com/ngrok/ngrok-py/blob/main/examples/ngrok-connect-full.py
    options['authtoken'] = os.environ.get('NGROK_AUTH_TOKEN', None)
    options['domain'] = os.environ.get('NGROK_DOMAIN', None)

    try:
        public_url = ngrok.connect(f"127.0.0.1:{port}", **options).url()
    except Exception as e:
        print(f'ngrok connection aborted due to: {e}\n'
              f'Invalid ngrok authtoken? Your token: {options["authtoken"]}, get the right one on https://dashboard.ngrok.com/get-started/your-authtoken\n'
              f'Invalid ngrok domain? Your domain: {options["domain"]}, get the right one on https://dashboard.ngrok.com/cloud-edge/domains\n')
    else:
        print(f'ngrok connected to localhost:{port}! URL: {public_url}\n'
              f'You can use this link after the launch is complete.')
        os.environ['NGROK_UP'] = '1'
