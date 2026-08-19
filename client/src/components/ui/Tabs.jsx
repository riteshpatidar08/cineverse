import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

const TabsContext = createContext(null);

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleTabChange }}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl glass border-white/20 dark:border-white/10 p-1.5 gap-1',
        className
      )}
      {...props}
    />
  );
};

export const TabsTrigger = ({
  value,
  className,
  disabled = false,
  ...props
}) => {
  const { activeTab, handleTabChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => handleTabChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
        isActive
          ? 'bg-primary/20 dark:bg-accent/20 text-primary dark:text-accent border border-primary/20 dark:border-accent/20 shadow-inner'
          : 'bg-transparent text-text/70 hover:text-text-h hover:bg-white/5 border border-transparent',
        className
      )}
      {...props}
    />
  );
};

export const TabsContent = ({
  value,
  className,
  children,
  ...props
}) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      className={cn('focus-visible:outline-none animate-fadeIn', className)}
      {...props}
    >
      {children}
    </div>
  );
};
