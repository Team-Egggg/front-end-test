function Button({ name }) {
  return (
    <button data-testid="button" type="button">
      {name}
    </button>
  );
}

export default Button;
