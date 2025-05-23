const MessageCard = ({ message, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';

  return (
    <div className={`p-4 mt-4 rounded-md border ${bgColor} ${textColor} ${borderColor}`}>
      <p className="text-center font-medium">{message}</p>
    </div>
  );
};

export default MessageCard;
