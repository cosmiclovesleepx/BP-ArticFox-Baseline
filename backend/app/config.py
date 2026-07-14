from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://polarops:polarops_dev_only@localhost:5432/polarops"
    env: str = "test"
    auth_mode: str = "fake"  # "fake" (pruebas) | "blackpolar" (real)
    blackpolar_api_url: str = "https://api.blackpolar.org"

    class Config:
        env_file = ".env"


settings = Settings()
