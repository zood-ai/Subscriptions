import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionOption } from '../CustomTable';

const Actions = ({
  selectedIds,
  actions,
}: {
  selectedIds: string[];
  actions: ActionOption[];
}) => {
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
      <span className="text-sm font-semibold text-foreground">
        {selectedIds.length} Selected
      </span>
      {hasSelection && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors">
            Actions
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {actions?.map((action) => (
              <DropdownMenuItem
                key={action.label}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!hasSelection && (
        <div className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground/50 bg-muted/50 rounded-md cursor-not-allowed">
          Actions
          <ChevronDown className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default Actions;
