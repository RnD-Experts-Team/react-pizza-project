'use client'

import { useState } from 'react'
import { ChevronDownIcon, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface SingleDatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  maxDate?: Date
  minDate?: Date
  className?: string
}

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  maxDate,
  minDate,
  className = '',
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
  }

  const getDisabledDates = () => {
    const disabledConditions: any = {}
    
    if (maxDate) {
      disabledConditions.after = maxDate
    }
    
    if (minDate) {
      disabledConditions.before = minDate
    }
    
    return Object.keys(disabledConditions).length > 0 ? disabledConditions : undefined
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between font-normal ${className}`}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {value
              ? value.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : placeholder}
          </div>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={getDisabledDates()}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}

export default SingleDatePicker