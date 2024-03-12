export interface Pago {
    pagoId: number
    cuota: number
    fechaPago: string
    numeroSocio: number
}

export interface PagoSocio {
    numeroSocio: number
    nombre: string
    dni: string
    fechaNacimiento: string
    telefono: string
    direccion: string
    localidad: string
    foto: string
    cuota: number
    fechaPago: string
    pagoId:number, 
    primerApellido: string,
    segundoApellido: string,
    flag: number
}

export interface PagarCuotaSocio{
    cuota:number,
    fechaPago: Date,
    numeroSocio: number
}

export interface ModificarPago{
    pagoId: number,
    cuota: number
}
