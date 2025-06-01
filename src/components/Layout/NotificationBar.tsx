import React from 'react';

interface NotificationBarProps {
  message: string;
  title?: string;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, title }) => {
  return (
    <div className="bg-black w-full py-4" style={{ textAlign: 'center' }}>
      {title && (
        <h2 className="text-white text-lg md:text-xl font-bold mb-1">
          {title}
        </h2>
      )}
      <p className="text-white text-sm md:text-base">
        {message}
      </p>
    </div>
  );
};

export default NotificationBar;
