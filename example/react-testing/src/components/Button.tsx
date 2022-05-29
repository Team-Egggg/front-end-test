function Button({ name }: { name: string }) {
  return (
    <button data-testid="button" type="button">
      {name}
    </button>
  );
}

export default Button;
