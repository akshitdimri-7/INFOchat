const Header = () => {
  const chat = [{ chat: "chat1" }];
  return (
    <div className="p-6">
      {chat.length === 0 ? (
        <p className="text-lg mb-6">Create a new chat to get continue.</p>
      ) : (
        <p className="text-lg mb-6">Hello, how can I assist you today?</p>
      )}
    </div>
  );
};

export default Header;
