import os


def load_dotenv(dotenv_dir=".", dotenv_name=".env"):
    dotenv_path = os.path.join(dotenv_dir, dotenv_name)
    with open(dotenv_path, encoding="utf-8") as dotenv_file:
        for line in dotenv_file:
            line = line.strip()
            if line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key] = value


if __name__ == "__main__":
    load_dotenv()
