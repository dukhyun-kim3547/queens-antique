// 작품 한 개의 데이터 형태.
export type Item = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  era: string | null;
  origin: string | null;
  dimensions: string | null;
  condition_note: string | null;
  inspection_grade: "remote" | "in_person" | null;
  storage_status: "seller" | "queens" | null;
  photos: string[];
  start_price: number;
  current_price: number;
  reserve_price: number;
  step_interval_days: number;
  step_percent: number;
  next_drop_date: string | null;
  status: "pending" | "selling" | "sold" | "withdrawn";
  created_at: string;
};
