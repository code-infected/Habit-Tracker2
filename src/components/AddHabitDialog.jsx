import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const AddHabitDialog = ({ open, onOpenChange, onAddHabit }) => {
  const [title, setTitle] = useState("");

  // Reset title when dialog opens
  useEffect(() => {
    if (open) {
      setTitle("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddHabit({ title: title.trim() });
      setTitle("");
      onOpenChange(false);
    }
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Habit Name
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Enter habit name"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Habit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;