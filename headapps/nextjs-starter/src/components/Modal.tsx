import { JSX, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from 'src/core/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from 'src/core/ui/dialog';
import { ModalProps } from 'src/types/Modal.types';
import { Placeholder, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cn } from 'src/core/lib/utils';
import { SitecoreImage } from 'src/core/atom/Images';

const allowedVariants = ['link', 'primary', 'outline', 'secondary'] as const;

type ButtonVariant = (typeof allowedVariants)[number];

const Modal = ({ fields, params, rendering }: ModalProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const placeholderKey = `modal-${params.DynamicPlaceholderId}`;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const isAllowedVariant = allowedVariants.includes(params?.ButtonStyle as ButtonVariant);
  const btnVariant = isAllowedVariant ? (params?.ButtonStyle as ButtonVariant) : 'default';
  const btnDirection = params?.Styles;

  return (
    <div className="my-8 w-full">
      <Button
        onClick={handleOpen}
        size="lg"
        variant={btnVariant}
        className={cn('my-2 max-w-80 w-full')}
      >
        <div
          className={cn('flex items-center', {
            'flex-row-reverse gap-4': btnDirection == 'position-right',
            'flex-col py-4 h-auto gap-3': btnDirection == 'position-center',
            'gap-4': btnDirection !== 'position-right' && btnDirection !== 'position-center',
          })}
        >
          {fields?.ButtonImage && (
            <div
              className={cn(
                'flex items-center justify-center flex-shrink-0 rounded-md overflow-hidden',
                {
                  'w-4 h-4': btnDirection !== 'position-center',
                  'w-6 h-6': btnDirection === 'position-center',
                }
              )}
            >
              <SitecoreImage
                field={fields.ButtonImage}
                className="w-full h-full aspect-square object-cover"
                alt=""
                aria-hidden="true"
              />
            </div>
          )}
          <span>
            <Text field={fields.ButtonText} />
          </span>
        </div>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-600 bg-background">
          <DialogHeader className="flex flex-row items-center justify-between gap-3 relative">
            <DialogTitle className="pr-6 text-primary">
              <Text field={fields.Title} />
            </DialogTitle>
            <DialogClose className="absolute right-0 -top-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:ring-2 active:ring-ring active:bg-gray-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Placeholder name={placeholderKey} rendering={rendering} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withDatasourceCheck()<ModalProps>(Modal);
