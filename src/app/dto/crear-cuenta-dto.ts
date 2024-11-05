export interface CrearCuentaDTO {
    cedula: string;
    nombre: string;
    apellido: string;
    telefono: string[];
    direccion?: string;
    ciudad: String;
    email: string;
    contrasena: string;
    rol: String;
}
