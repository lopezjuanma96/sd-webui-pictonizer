const sdUrl = window.location.origin;

const txt2imgPath = "/sdapi/v1/txt2img";
const txt2imgUrl = sdUrl + txt2imgPath;
const txt2imgBody = {
    "enable_hr": false,
    "denoising_strength": 0,
    "firstphase_width": 0,
    "firstphase_height": 0,
    "hr_scale": 2,
    "hr_upscaler": "",
    "hr_second_pass_steps": 0,
    "hr_resize_x": 0,
    "hr_resize_y": 0,
    "hr_sampler_name": "",
    "hr_prompt": "",
    "hr_negative_prompt": "",
    "prompt": "",
    "styles": [], // list of strings
    "seed": -1,
    "subseed": -1,
    "subseed_strength": 0,
    "seed_resize_from_h": -1,
    "seed_resize_from_w": -1,
    "sampler_name": "DDIM",
    "batch_size": 1,
    "n_iter": 1,
    "steps": 25,
    "cfg_scale": 10,
    "width": 512,
    "height": 512,
    "restore_faces": false,
    "tiling": false,
    "do_not_save_samples": false,
    "do_not_save_grid": false,
    "negative_prompt": "",
    "eta": 0,
    "s_min_uncond": 0,
    "s_churn": 0,
    "s_tmax": 0,
    "s_tmin": 0,
    "s_noise": 1,
    "override_settings": {},
    "override_settings_restore_afterwards": true,
    "script_args": [],
    "sampler_index": "",
    "script_name": "",
    "send_images": true,
    "save_images": true,
    "alwayson_scripts": {}
  }

const isDev = window.location.href.includes("?dev=true");