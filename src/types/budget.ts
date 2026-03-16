export type Status = 'Aprovado' | 'Rascunho' | 'Enviado' | 'Recusado';

export interface Budget {
  id: string;
  cliente: string;
  projeto: string;
  valor: number;
  data: string;
  status: Status;
}