import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilteredChangeHistoryProps {
  tableName?: string;
  className?: string;
}

export const FilteredChangeHistory = ({ tableName, className }: FilteredChangeHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [userFilter, setUserFilter] = useState("");

  const { data: history, isLoading } = useQuery({
    queryKey: ["change-history", tableName, selectedDate, userFilter],
    queryFn: async () => {
      let query = supabase
        .from("change_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (tableName) {
        query = query.eq("table_name", tableName);
      }

      if (selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        query = query.gte("created_at", `${dateStr}T00:00:00`)
          .lt("created_at", `${dateStr}T23:59:59`);
      }

      if (userFilter) {
        query = query.ilike("created_by", `%${userFilter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[200px]",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          placeholder="Filter by user..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="w-[200px]"
        />
        {(selectedDate || userFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedDate(undefined);
              setUserFilter("");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {isLoading ? (
          <div>Loading changes...</div>
        ) : history?.length === 0 ? (
          <div className="text-muted-foreground">No changes found</div>
        ) : (
          <div className="space-y-4">
            {history?.map((change) => (
              <div key={change.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {change.table_name === "employees" ? "Employee" : "Project"}{" "}
                    {change.change_type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      by {change.created_by}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(change.created_at), "PPp")}
                    </span>
                  </div>
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
        )}
      </ScrollArea>
    </div>
  );
};