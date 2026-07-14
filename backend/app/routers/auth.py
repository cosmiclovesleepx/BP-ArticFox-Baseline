"""
AUTH_MODE=fake (default en pruebas): cualquier usuario/contraseña entra,
no se llama a ninguna API externa. Útil para desarrollar el resto del
sistema sin depender de credenciales reales.

AUTH_MODE=blackpolar: valida contra api.blackpolar.org. Activar solo
cuando se configure la integración real (último paso del roadmap).
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str
    role: str


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    if settings.auth_mode == "fake":
        if not body.username or not body.password:
            raise HTTPException(400, "Usuario y contraseña requeridos")
        return LoginResponse(token="fake-dev-token", username=body.username, role="admin")

    if settings.auth_mode == "blackpolar":
        # TODO (fase final): llamar a settings.blackpolar_api_url + "/auth/login"
        # con httpx, propagar el token/usuario reales, y mapear el rol.
        raise HTTPException(501, "AUTH_MODE=blackpolar aún no está implementado")

    raise HTTPException(500, f"AUTH_MODE inválido: {settings.auth_mode}")
