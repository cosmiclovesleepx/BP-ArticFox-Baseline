"""
Registro central de scripts. La llave (ej. "cliente-x.aire") es el valor que
se guarda en module_scripts.entrypoint y el que se define al crear un módulo
desde la UI ("módulo para crear módulos"). No se ejecuta código dinámico por
nombre de archivo: solo funciones explícitamente registradas aquí.

Para añadir un script Python ya existente:
1. Colócalo (o un wrapper delgado) en app/workers/<modulo>/<script>.py
2. Asegúrate que exponga: def run(file_path: str, params: dict, log) -> dict
3. Impórtalo y agrégalo aquí con su clave.
"""
from app.workers.cliente_x import aire as cliente_x_aire

REGISTRY = {
    "cliente-x.aire": cliente_x_aire.run,
    # "cliente-x.tierra": cliente_x_tierra.run,
    # "cliente-x.naviera": cliente_x_naviera.run,
    # "cliente-y.facturas": cliente_y_facturas.run,
}
