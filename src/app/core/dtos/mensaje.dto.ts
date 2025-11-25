export interface MensajeDto {
    id?: string;
    telefono?: string;
    texto?: string;
    direccion?: 'in' | 'out'; 
    timestamp?: string;
}
