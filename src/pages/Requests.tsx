import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import RequestsTable from "@/components/requests/RequestsTable";
import AddRequestForm from "@/components/requests/AddRequestForm";

const Requests = () => {
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Resource Requests</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Resource Request</DialogTitle>
              </DialogHeader>
              <AddRequestForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <RequestsTable />
      </div>
    </Layout>
  );
};

export default Requests;