# Stable Diffusion WebUI for Pictonizer

This is a fork of [AUTOMATIC1111's](https://github.com/AUTOMATIC1111) [StableDiffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui), for the creation of a Pictonizer.
The idea is to provide a simple and stable WebUI for the Stable Diffusion Model trained on Pictograms.

You can go to the original repo for more data on WebUI specifically, this are the modifications we propose:

- [x] Add a new page for the Pictonizer
- [x] Serve the Pictonizer page: for now on `/gui/pictonizer`, maybe redirect from root as well. This is done adding a [static handler](https://fastapi.tiangolo.com/tutorial/static-files/) on the API definition, in [](modules/api/api.py).
- [x] Remove access to the original WebUI, to avoid breaking something, this will just be changing the start function on [](modules/launch_utils.py) script.
- [ ] Add a middleware or extra request to improve - and maybe also translate - the user's prompt using an LLM model, for example using OpenAI GPT4 API.
- [ ] Add a postgeneration Picto Editor, to allow the user to edit the generated pictogram, with simple tools such as brush, eraser, color picker, etc. (like [this](https://github.com/JonSteinn/Web-Paint))
