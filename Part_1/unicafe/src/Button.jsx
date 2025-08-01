const Button = ({onclickFunc, text}) => {
    return (
        <button onClick={onclickFunc}>{text}</button>
    )
}
export default Button