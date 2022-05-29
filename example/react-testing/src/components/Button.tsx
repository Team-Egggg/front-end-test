import { MouseEventHandler } from "react";

function Button({
  name,
  onClick,
}: {
  name: string;
  onClick: MouseEventHandler;
}) {
  return (
    <button data-testid="button" onClick={onClick}>
      {name}
    </button>
  );
}

export default Button;
