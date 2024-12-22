import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

const HabitCard = ({ id, title, status, frequency, onComplete, onDelete }) => {
  const progress = status === 'completed' ? 100 : 0;
  const completedToday = status === 'completed';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={onComplete}
              className="text-gray-600 hover:text-habit-primary transition-colors"
            >
              {completedToday ? (
                <CheckCircle2 className="h-6 w-6 text-habit-primary" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Frequency</span>
            <span className="font-semibold capitalize">{frequency}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Status</span>
            <span className="font-semibold capitalize">{status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;