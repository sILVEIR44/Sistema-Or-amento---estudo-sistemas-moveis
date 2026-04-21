export type Status = 'Aprovado' | 'Rascunho' | 'Enviado' | 'Recusado';

export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  quantidade: number;
}

export interface Budget {
  id: string;
  cliente: string;
  projeto: string;
  valor: number;
  status: Status;
  servicos: Servico[];
  desconto: number;
  criadoEm: string;
  atualizadoEm: string;
}