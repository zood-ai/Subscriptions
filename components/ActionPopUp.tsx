'use client';
import { Button } from './ui/button';
import useCustomMutation, { HttpMethod } from '@/lib/Mutation';
import { useRouter } from 'next/navigation';

interface ActionPopUpProps {
  endPoint: string;
  method: HttpMethod;
  btnTitle: string;
  message: string;
  backUrl?: string;
}

const ActionPopUp: React.FC<ActionPopUpProps> = ({
  endPoint,
  method,
  btnTitle,
  message,
  backUrl,
}) => {
  const router = useRouter();
  const { mutate, isPending, error } = useCustomMutation<void, void>({
    api: endPoint,
    method,
    options: {
      onSuccess: () => {
        if (backUrl) router.push(backUrl);
      },
    },
  });

  const handleConfirm = () => {
    mutate();
  };

  return (
    <div>
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
      </div>

      <div className="flex items-center flex-row-reverse mt-3 relative justify-between gap-3 pt-4">
        <Button
          onClick={handleConfirm}
          variant="danger"
          disabled={isPending}
          loading={isPending}
          className={`${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isPending ? btnTitle + 'ing...' : btnTitle}
        </Button>
        {error && (
          <p className="text-red-600 font-bold">{error.data?.message}</p>
        )}
      </div>
    </div>
  );
};

export default ActionPopUp;
