import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LoadingSkeleton() {
  return (
    <div className="p-4">
      <Skeleton height={40} className="mb-4" />
      <Skeleton height={20} count={3} />
    </div>
  );
}