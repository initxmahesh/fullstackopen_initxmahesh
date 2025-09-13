const Logout = () => {
  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };
  return (
    <>
      <button onClick={handleLogout}>logout</button>
    </>
  );
};

export default Logout;
