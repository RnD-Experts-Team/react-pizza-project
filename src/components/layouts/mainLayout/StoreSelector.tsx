import React, { useState } from 'react';
import { Button } from '../../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Store, ChevronDown, Check } from 'lucide-react';
import type { StoreSelectProps } from './types';

const StoreSelector: React.FC<StoreSelectProps> = ({
  stores,
  currentStore,
  onStoreChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleStoreSelect = (storeId: string) => {
    // Find the store object to pass to the callback
    const selectedStore = stores.find(store => store.id === storeId);
    if (selectedStore && onStoreChange) {
      onStoreChange(selectedStore);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 md:h-10 text-xs p-1 sm:p-2 bg-sidebar/50 border-sidebar-border hover:bg-sidebar-accent/50 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-1.5"
        >
          <div className="m-1 flex flex-col items-start min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="font-medium text-xs truncate w-full text-left">
              {currentStore.name}
            </span>
            <span className="text-muted-foreground text-xs truncate w-full text-left hidden sm:block">
              {currentStore.metadata.address || 'No address'}
            </span>
          </div>
          <Store className="group-data-[collapsible=icon]:block hidden h-4 w-4" />
          <ChevronDown className="ml-1 sm:ml-2 h-2 w-2 sm:h-3 sm:w-3 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] sm:w-[280px] p-0 bg-popover border-border">
        <Command className="bg-popover">
          <CommandInput
            placeholder="Search stores..."
            className="h-7 sm:h-8"
          />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  value={`${store.name} ${store.metadata.address || ''}`}
                  onSelect={() => {
                    handleStoreSelect(store.id);
                  }}
                  className="flex items-center space-x-2 p-1.5 sm:p-2"
                >
                  <Check
                    className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${
                      currentStore.id === store.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {store.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {store.metadata.address || 'No address'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSelector;