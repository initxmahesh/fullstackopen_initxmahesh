const Notify = ({ message, type }) => {
  if (!message) {
    return null;
  }
  return <div className={type ==="success" ? "success":"error"}>{message}</div>;
};

export default Notify;
