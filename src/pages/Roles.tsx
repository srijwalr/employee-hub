import { RolesTable } from "@/components/roles/RolesTable";
import { AddRoleForm } from "@/components/roles/AddRoleForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Roles = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <AddRoleForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <RolesTable />
    </div>
  );
};

export default Roles;