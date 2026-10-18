import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-[#DCFCE7] text-[#15803D]',
        warning: 'border-transparent bg-[#FEF3C7] text-[#B45309]',
        danger: 'border-transparent bg-[#FEE2E2] text-[#B91C1C]',
        info: 'border-transparent bg-[#E0F2FE] text-[#0369A1]',
        superadmin: 'border-transparent bg-[#F3E8FF] text-[#6B21A8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
