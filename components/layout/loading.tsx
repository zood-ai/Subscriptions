import Spinner from '@/components/ui/spinner';

const LoadingComponent = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default LoadingComponent;
