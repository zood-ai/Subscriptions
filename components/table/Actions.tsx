import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionOption } from '../CustomTable';
import { useState } from 'react';
import CustomModal from '../layout/CustomModal';
import ActionPopUp, { Input } from '../ActionPopUp';

const Actions = ({
  selectedIds,
  baseEndPoint,
  actions,
}: {
  selectedIds: string[];
  baseEndPoint: string;
  actions: ActionOption[];
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionOption | null>(
    null
  );
  const Inputs: Input[] = [
    {
      key: 'ids',
      label: 'Ids',
      isHidden: true,
      isRequired: true,
      value: selectedIds,
      type: 'array',
    },
    ...(selectedAction?.inputs || []),
  ];
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
            {actions?.map((action, idx) => (
              <DropdownMenuItem
                key={idx}
                onClick={() => setSelectedAction(action)}
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
      {selectedAction !== null && (
        <CustomModal
          title={selectedAction.label}
          btnTrigger={<></>}
          opened={true}
          onClose={() => setSelectedAction(null)}
        >
          <ActionPopUp
            message={selectedAction?.message}
            endPoint={`${baseEndPoint}/bulk-${selectedAction.actionType}`}
            btnTitle={selectedAction.label}
            method={selectedAction.method}
            inputs={Inputs}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default Actions;
