interface Data {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
}

export interface Responce {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}
