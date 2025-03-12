export interface User {
    id: string;
    nome: string;
    sobrenome: string | null;
    academiaId: string;
    clienteId: string;
    token: string;
}