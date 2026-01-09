import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SlickArrowButtonProps {
  direction: 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

const SlickArrowButton = ({ direction, className, onClick }: SlickArrowButtonProps) => {
  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Go to previous slide' : 'Go to next slide'}
      onClick={onClick}
      className={cn(
        'pointer-events-auto w-10 h-10 slick-arrow absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
        'flex items-center justify-center',
        'bg-black/30 hover:bg-black/50 rounded-full transition-all',
        '[&.slick-arrow::before]:hidden [&.slick-arrow]:opacity-100',
        direction === 'left' ? 'left-4' : 'right-4',
        className
      )}
    >
      {direction === 'left' ? (
        <ChevronLeft size={28} className="text-white" strokeWidth={2.5} />
      ) : (
        <ChevronRight size={28} className="text-white" strokeWidth={2.5} />
      )}
    </button>
  );
};

export default SlickArrowButton;
