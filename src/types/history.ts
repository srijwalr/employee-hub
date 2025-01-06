export interface ChangeHistory {
  id: string;
  table_name: string;
  record_id: string;
  change_type: string;
  changes: Record<string, any>;
  created_at: string;
  created_by: string | null;
}