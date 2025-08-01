const Button = ({onclickFunc, label}) => {
    return (
        <button onClick={onclickFunc}>{label}</button>
    )
}
export default Button