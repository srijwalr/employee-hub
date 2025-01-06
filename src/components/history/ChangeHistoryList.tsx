import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChangeHistory } from "@/types/history";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export const ChangeHistoryList = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["change-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("change_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ChangeHistory[];
    },
  });

  if (isLoading) return <div>Loading history...</div>;

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Changes</h3>
        {history?.map((change) => (
          <div key={change.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {change.table_name === "employees" ? "Employee" : "Project"}{" "}
                {change.change_type}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(change.created_at), { addSuffix: true })}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Object.entries(change.changes).map(([key, value]) => (
                <div key={key}>
                  {key}: {JSON.stringify(value)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};