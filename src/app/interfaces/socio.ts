export interface Socio {
    numeroSocio:number,
    nombre:string,
    dni: string,
    fechaNacimiento: string,
    telefono: string,
    direccion: string,
    localidad: string,
    borrado: string, 
    primerApellido: string,
    segundoApellido: string,
    flag: number,
    modificar: boolean;
    nuevoNumeroSocio: number;
}

export interface SocioData {
    numeroSocio: number
    nombre: string
    dni: string
    fechaNacimiento: string
    telefono: string
    direccion: string
    localidad: string
    foto: string, 
    pagado: string,
    primerApellido: string,
    segundoApellido: string,
    flag: number
  }