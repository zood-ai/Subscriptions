export interface Country {
  name_en: string;
  id: string;
  updated_at: string;
  created_at: string;
}

export interface CountryResponse {
  status: boolean;
  code: number;
  message: string;
  data: Country;
}
