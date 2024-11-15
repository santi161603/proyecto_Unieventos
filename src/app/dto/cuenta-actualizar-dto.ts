export interface CuentaActualizarDto {
    cedula: string,
    nombre: string,
    apellido: string,
    direccion?: string,
    telefono: string[],
    ciudad: string,
    email: string;
}
